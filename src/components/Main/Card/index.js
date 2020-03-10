import React from "react";
import { Container, Name, PlayerImg, Team } from "./styles";

export default class Card extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			name: props.name,
			imageUrl: `http://localhost:3008/${props.imageUrl}`,
			team: props.team
		}
	}

	render() {
		return (
			<Container>
				<Name>{this.state.name}</Name>
				<PlayerImg src={this.state.imageUrl} alt="player_image" />
				<Team>{this.state.team.name}</Team>
			</Container>
		)
	}
}
