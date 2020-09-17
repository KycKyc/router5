import React, { FunctionComponent, ComponentType } from 'react'
import { RouteContext } from '../types'
import RouteNode from '../render/RouteNode'

/**
 * 
 * @param nodeName name of the node
 * @param sliceFromleft how much segments to slice (e.g. 'en.user.orders' with sliceFromLeft = 1 will become 'user.orders')
 * @returns 
 */
function routeNode<P>(nodeName: string, sliceFromleft=0) {
    return function(BaseComponent: ComponentType<P & RouteContext>): FunctionComponent<P> {
        function RouteNodeWrapper(props: P) {
            return (
                <RouteNode nodeName={nodeName} sliceFromleft={sliceFromleft}>
                    {routeContext => (
                        <BaseComponent {...props} {...routeContext} />
                    )}
                </RouteNode>
            )
        }

        return RouteNodeWrapper
    }
}

export default routeNode
