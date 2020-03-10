import React from "react";
import axios from "axios"
import _ from "lodash"
import Search from "./Search";
import Card from "./Card";
import { Container } from "./styles";
import { Jumbotron, Pagination, Spinner, InputGroup, FormControl, Button } from 'react-bootstrap'

export default class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activePage: 1,
            loading: true,
            players: [],
            searchQuery: '',
            teams: [],
            totalPages: null
        }
    }

    render() {
        if (this.state.loading) {
            return  <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        }
        return (
            <Container>
                <Jumbotron>
                    <Container>
                        <h1>NBA Interview</h1>
                    </Container>
                </Jumbotron>

                <Pagination></Pagination>

                <div className="container">

                    <div className="row justify-content-start">
                        <InputGroup className="col-10 offset-1 mb-3">
                            <FormControl
                                placeholder="Search"
                                aria-label="Search"
                                aria-describedby="basic-addon1"
                                defaultValue={this.state.searchQuery}
                                onChange={(e) => {this.state.searchQuery = e.target.value}}
                            />
                            <Button
                                as={InputGroup.Append}
                                onClick={this.handleSearch}
                            >
                                Submit
                            </Button>
                        </InputGroup>
                    </div>

                    <div className="row justify-content-start">
                        {
                            this.state.players.map((player, index) => {
                                return (
                                    <div className="col-auto mb-4" key={index} >
                                        <Card name={player.name} imageUrl={player.image} team={player.team}/>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <Pagination></Pagination>
            </Container>
        )
    }

    async componentDidMount() {
        // get teams on component mount
        await this.getTeams().then(data => this.setState({ teams: data.data }))

        // get players once teams have been set
        await this.getPlayers().then(data => this.handlePlayerResponse(data))
    }

    getPages(data) {
        // retrieve json-server pagination links from response headers
        if (data.headers.link) {
            let links = data.headers.link.split(',').map((link) => {
                return link.split(';')
            })
            // find last link which contains total number of pages
            let last = _.last(links)
            let pageIndex = last[0].indexOf('_page')
            // parse total page number
            let lastPage = parseInt(_.trimEnd(last[0].substr(pageIndex + 6), '>'))
            // set totalPages state value
            this.setState({ totalPages: lastPage })
        }
    }

    getPlayers() {
        this.setState({ loading: true })

        let url = `http://localhost:3008/players?_page=${this.state.activePage}`

        if (this.state.searchQuery) url += `&q=${this.state.searchQuery}`

        return axios.get(url)
    }

    getTeams() {
        return axios.get('http://localhost:3008/teams')
    }

    handlePlayerResponse(data) {
        this.getPages(data)

        let players = this.setPlayerTeams(data)

        this.setState({ players, loading: false })
    }

    handleSearch = () => {
        this.setState({ activePage: 1 })
        this.getPlayers().then(data => this.handlePlayerResponse(data))
    }

    setPlayerTeams(data) {
        return data.data.map((player) => {
            // find team based on players team id
            let team = this.state.teams.find((team) => {
                return team.id === player.team
            })
            // set players team to player object
            player.team = team
            return player
        })
    }
}

