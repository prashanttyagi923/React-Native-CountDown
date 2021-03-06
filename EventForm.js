import React, { Component } from "react";
import { Text, View, TouchableHighlight, TextInput, StyleSheet, AsyncStorage } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import { formatDateTime } from './api'
import uuidv4 from 'uuid/v4';

const styles = StyleSheet.create({
    fieldContainer: {
        margin: 20,
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: '#fff'
    },
    text: {
        height: 60,
        margin: 0,
        marginRight: 7,
        paddingLeft: 10,
        fontSize: 30,
        fontWeight: '200',
        borderRadius: 5,
        marginTop: 5
    },
    button: {
        height: 50,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        alignSelf: 'stretch',
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    deleteButton: {
        backgroundColor: '#EC4848'
    },
    buttonText: {
        color: '#fff',
        fontSize: 18
    },
    borderTop: {
        borderColor: '#edeeef',
        borderTopWidth: 0.5
    }
})

class EventForm extends Component {
    constructor(props) {
        super(props)
        console.log('I got props')
        console.log(props.eventDetail)
        this.state = {
            title: null,
            date: ''
        };
        if (this.props.eventDetail && Object.keys(this.props.eventDetail).length > 0) {
            this.state = this.props.eventDetail
        }
    }
    handleAddPress = () => {
        //let navigation = this.props.navigation;
        console.log(this.state)
        let item = JSON.parse(JSON.stringify(this.state))
        if (!item.id) {
            item.id = uuidv4();
        }
        if (this.state.id) {
            console.log('executing b1')
            AsyncStorage.mergeItem(item.id, JSON.stringify(item)).then((err) => {
                if (err) {
                    console.log(err)
                }

                this.props.navigation.goBack();

            })
        }
        else {
            console.log('executing b2')
            AsyncStorage.setItem(item.id, JSON.stringify(item)).then((err) => {
                if (err) {
                    console.log(err)
                }

                this.props.navigation.goBack();
            })
        }
    }
    handleDeletePress = (navigation) => {
        AsyncStorage.removeItem(this.state.id).then((err) => {
            if (!err) {
                console.log('item removed successfully');
            }
            this.props.navigation.goBack();
        })
        
    }
    componentWillReceiveProps(nextProps) {
        console.log('I got next props');
        console.log(nextProps);
        this.setState({ title: nextProps.eventDetail.title, date: nextProps.eventDetail.date, id: nextProps.eventDetail.id });
    }
    handleChangeTitle = (value) => {
        this.setState({ title: value });
    }
    handleDatePress = () => {
        this.setState({ showDatePicker: true })
    }
    handleDatePickerHide = () => {
        this.setState({ showDatePicker: false })
    }
    handleDatePicked = (date) => {
        this.setState({
            date
        })
        this.handleDatePickerHide();
    }
    _renderDelete() {
        if (this.state.id) {
            return (
                <TouchableHighlight
                    onPress={this.handleDeletePress}
                    style={[styles.button, styles.deleteButton]}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableHighlight>
            )
        } else {
            return null;
        }
    }
    render() {
        return (
            <View style={{
                flex: 1
            }}>
                <View style={styles.fieldContainer}>
                    <TextInput style={styles.text}
                        placeholder="Event Name"
                        spellCheck={false}
                        value={this.state.title}
                        onChangeText={this.handleChangeTitle}
                        underlineColorAndroid='rgba(0,0,0,0)'
                    />
                    <TextInput style={[styles.text, styles.borderTop]}
                        placeholder="Event Date"
                        spellCheck={false}
                        editable={!this.state.showDatePicker}
                        value={formatDateTime(this.state.date.toString())}
                        onFocus={this.handleDatePress}
                        onPress={this.handleDatePress}
                        underlineColorAndroid='rgba(0,0,0,0)'
                    />
                    <DateTimePicker
                        isVisible={this.state.showDatePicker}
                        mode="datetime"
                        onConfirm={this.handleDatePicked}
                        onCancel={this.handleDatePickerHide}
                    />
                </View>
                <TouchableHighlight
                    onPress={this.handleAddPress}
                    style={styles.button}>
                    <Text style={styles.buttonText}>{this.state.id ? "Update" : "Add"}</Text>
                </TouchableHighlight>
                {this._renderDelete(this.props.navigation)}
            </View>
        )
    }
}
export default EventForm;