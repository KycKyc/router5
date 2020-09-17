import React, { ReactNode, FunctionComponent } from 'react'
import { shouldUpdateNode, sliceName } from 'router5-transition-path'
import { RouteContext } from '../types'
import { routeContext } from '../context'

export interface RouteNodeProps {
    nodeName: string,
    sliceFromleft: number
    children: (routeContext: RouteContext) => ReactNode
}

class RouteNodeRenderer extends React.Component<RouteNodeProps & RouteContext> {
    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps) {
        return shouldUpdateNode(this.props.nodeName, this.props.sliceFromleft)(
            nextProps.route,
            nextProps.previousRoute
        )
    }

    render() {
        const { router, previousRoute, sliceFromleft } = this.props
        const route = { ... this.props.route, name: sliceName(this.props.route.name, sliceFromleft)}
        return this.props.children({ router, route, previousRoute })
    }
}

const RouteNode: FunctionComponent<RouteNodeProps> = props => {
    return (
        <routeContext.Consumer>
            {routeContext => <RouteNodeRenderer {...props} {...routeContext} />}
        </routeContext.Consumer>
    )
}

export default RouteNode
