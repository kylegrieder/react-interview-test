import React from "react";
import axios from "axios"
import moment from "moment"
import _ from "lodash"
import { Container, Name, PlayerImg, Team } from "./styles";
import { Button, FormControl, FormLabel } from "react-bootstrap"

export default class Card extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			college: props.player.college,
			editing: false,
			id: props.player.id,
			image: props.player.image,
			name: props.player.name,
			player: props.player,
			position: props.player.position,
			saveText: 'Save',
			team: props.player.team,
			teams: props.teams
		}
	}

	render() {
		if (this.state.editing) {
			return (
				<Container>
					<FormLabel>Name</FormLabel>
					<FormControl
						as="input"
						defaultValue={this.state.name}
						onChange={(e) => {this.setState({name: e.target.value})}}
						className="mb-3 mt-0"
					/>
					<FormLabel>Image Url</FormLabel>
					<FormControl
						as="input"
						defaultValue={this.state.image}
						onChange={(e) => {this.setState({imageUrl: e.target.value})}}
						className="mb-3 mt-0"
					/>
					<FormLabel>Team</FormLabel>
					<FormControl
						as="select"
						className="mb-1"
						defaultValue={this.state.team.id}
						onChange={this.handleTeamChange}
					>
						{this.state.teams.map((team, index) => {
							return (
								<option key={index} value={team.id}>{team.name}</option>
							)
						})}
					</FormControl>
					<Button
						variant="primary"
						onClick={this.savePlayerUpdates}
					>
						{ this.state.saveText }
					</Button>
				</Container>
			)
		}
		return (
			<Container>
				<Name>{this.state.name}</Name>
				<PlayerImg src={`http://localhost:3008/${this.state.image}`} alt="player_image" />
				<Team>{this.state.team.name}</Team>
				<Button
					variant="warning"
					onClick={() => {this.setState({ editing: !this.state.editing })}}
				>
					Edit
				</Button>
			</Container>
		)
	}

	handleTeamChange = (event) => {
		let teamId = event.target.value
		let team = this.state.teams.find((team) => {
			return team.id == teamId
		})

		this.setState({ team })
	}

	savePlayerUpdates = () => {
		this.setState({ saveText: '...' })
		this.updateServerData().then(() => {
			this.setState({ editing: !this.state.editing, saveText: 'Save' })
		})
	}

	updateServerData = () => {
		let updatedPlayer = _.pick(this.state, Object.keys(this.state.player))
		updatedPlayer.team = this.state.team.id
		updatedPlayer.editedAt = moment().format()

		return axios.patch(`http://localhost:3008/players/${this.state.id}`, updatedPlayer, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
	}
}
