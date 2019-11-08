import React, { PureComponent } from 'react'

import { Wrapper, LogoWrapper, Name, Shadow, Logo} from './styles'

export class HeaderComponent extends PureComponent {
	render() {

		const {
			lost,
			onAdmin,
		} = this.props.viewstate

		return (
			<Wrapper lost={lost} border={onAdmin}>
				<LogoWrapper to='/'>
					<Logo />
					<Name>YVIDEO</Name>
					<Shadow>YVIDEO</Shadow>
				</LogoWrapper>
			</Wrapper>
		)
	}
}

export const Header = HeaderComponent