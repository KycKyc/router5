import transitionPath, { sliceName } from './transitionPath'
import { State } from './transitionPath'

/**
 *
 * @param nodeName name of the node
 * @param sliceFromleft  how much segments to slice (e.g. 'en.user.orders' with sliceFromLeft = 1 will become 'user.orders')
 * @returns
 */
export default function shouldUpdateNode(nodeName: string, sliceFromleft = 0) {
    return (toState: State, fromSate: State): boolean => {
        let {
            intersection,
            toActivate,
            toDeactivate: toDeactivateReversed
        } = transitionPath(toState, fromSate)

        intersection = sliceName(intersection, sliceFromleft)
        toActivate = toActivate.map(sliceName).filter(value => value != '')
        toDeactivateReversed = toDeactivateReversed
            .map(sliceName)
            .filter(value => value != '')

        const toDeactivate = [...toDeactivateReversed].reverse()

        if (toState.meta.options && toState.meta.options.reload) {
            return true
        }

        if (nodeName === intersection) {
            return true
        }

        if (toActivate.indexOf(nodeName) === -1) {
            return false
        }

        let matching = true

        for (let i = 0; i < toActivate.length; i += 1) {
            const activatedSegment = toActivate[i]
            const sameLevelDeactivatedSegment = toDeactivate[i]

            matching = activatedSegment === sameLevelDeactivatedSegment

            if (matching && activatedSegment === nodeName) {
                return true
            }

            if (!matching) {
                return false
            }
        }

        return false
    }
}
