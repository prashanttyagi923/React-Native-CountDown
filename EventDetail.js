import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import EventForm from "./EventForm";

export default class EventDetail extends Component {
    constructor(props) {
        super(props);
        console.log('my pros');
        console.log(props)
    }
    state = {
        eventDetail: {}
    }
    componentDidMount() {
        const { navigation } = this.props;
        AsyncStorage.getItem(navigation.getParam('id', 'default'), (err, result) => {
            console.log(result);
            result = JSON.parse(result);
            result.date = new Date(result.date)
            this.setState({ eventDetail: result })
            console.log('I seeted')
        });
    }
    render() {
        return (
            // []
            <EventForm eventDetail={this.state.eventDetail} navigation={this.props.navigation} />
        )
    }
}