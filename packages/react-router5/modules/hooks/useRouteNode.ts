import { shouldUpdateNode, sliceName } from 'router5-transition-path'
import { useContext, useEffect, useState } from 'react'
import { routerContext } from '../context'
import { RouteContext } from '../types'

export type UnsubscribeFn = () => void

/**
 *
 * @param nodeName name of the node
 * @param sliceFromleft how much segments to slice (e.g. 'en.user.orders' with sliceFromLeft = 1 will become 'user.orders')
 * @returns
 */
export default function useRouteNode(
    nodeName: string,
    sliceFromleft = 0
): RouteContext {
    const router = useContext(routerContext)
    const route = {
        ...router.getState(),
        name: sliceName(router.getState().name, sliceFromleft)
    }

    const [state, setState] = useState(() => ({
        previousRoute: null,
        route
    }))

    useEffect(
        () =>
            router.subscribe(({ route, previousRoute }) => {
                const shouldUpdate = shouldUpdateNode(nodeName, sliceFromleft)(
                    route,
                    previousRoute
                )

                if (shouldUpdate) {
                    route = {
                        ...route,
                        name: sliceName(route.name, sliceFromleft)
                    }
                    setState({
                        route,
                        previousRoute
                    })
                }
            }) as UnsubscribeFn,
        []
    )

    return { router, ...state }
}
