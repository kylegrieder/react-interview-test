import React from "react";
import axios from 'axios'
import Search from "./Search";
import Card from "./Card";
import { Container, Title } from "./styles";

export default class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            players: [],
            teams: []
        }
    }

    componentDidMount() {
        // get teams on component mount
        this.getTeams().then((data) => {
            // set teams to state
            this.setState({ teams: data.data })

            // get players once teams have been set
            this.getPlayers().then(({data}) => {
                // find each players team
                let players = data.map((player) => {
                    let team = this.state.teams.find((team) => {
                        return team.players.includes(player.team)
                    })
                    // set players team to player object
                    player.team = team
                    return player
                })
                this.setState({ players, loading: false })
            })
        })
    }

    render() {
        if (this.state.loading) {
            return  <div>Loading...</div>
        }
        return (
            <Container>
                <Title>NBA Interview</Title>
                <Search />

                {
                    this.state.players.map((player, index) => {
                        return <Card key={index} name={player.name} imageUrl={player.image} team={player.team}/>
                    })

                }
            </Container>
        )
    }

    getPlayers() {
        return axios.get('http://localhost:3008/players')
    }

    getTeams() {
        return axios.get('http://localhost:3008/teams')
    }
}

