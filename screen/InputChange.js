import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  TextInput,
  View,
  KeyboardAvoidingView,
  Button,
  FlatList,
  Text,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import formatAmount from '../lib/formatAmount';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default class InputChange extends Component {
  state = {
    name: '',
    collector: '',
    amount: '',
    months: new Set(),
  };

  handleChange = (text, name) => {
    if (name === 'amount') {
      // text = parseInt(text) === NaN ? 0 : text;
      text = text.replace(/[^0-9]/g, '');
    }
    this.setState({ [name]: text });
    console.log(this.state);
  };

  componentDidUpdate() {
    console.log('holh', this.state);
  }

  select = i => {
    this.setState(({ months }) => {
      if (months.has(i)) {
        const newMonths = new Set(months);
        newMonths.delete(i);
        return { months: newMonths };
      } else return { months: new Set(months.add(i)) };
    });
  };

  handleSubmit = () => {
    const { name, collector, amount, months } = this.state;
    let body = {
      name,
      collector,
      amount: +amount,
      months: Array.from(months),
    };
    console.log(body);
    body = JSON.stringify(body);
    console.log(body);

    fetch('http://192.168.0.156:3000/payments', {
      method: 'POST',
      body,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => console.log(response))
      // .then(data => this.setState({ payments: [...data] }))
      .catch(error => console.log(error));
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            alignItems: 'center',
          }}
        >
          <Button onPress={this.handleSubmit} color="#40b34f" title="Save" />
          <TextInput
            style={{ height: 40, width: 100, textAlign: 'center' }}
            value={this.state.name}
            placeholder="name"
            onChangeText={text => this.handleChange(text, 'name')}
            onSubmitEditing={() => console.log(this.state)}
          />
          <TextInput
            style={{ height: 40, width: 100, textAlign: 'center' }}
            value={this.state.collector}
            placeholder="collector"
            onChangeText={text => this.handleChange(text, 'collector')}
          />
          <TextInput
            style={{ height: 40, width: 100, textAlign: 'center' }}
            keyboardType="numeric"
            returnKeyType="done"
            value={this.state.amount ? formatAmount(this.state.amount) : ''}
            placeholder="amount"
            onChangeText={text => this.handleChange(text, 'amount')}
          />
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {months.map((month, i) => (
              <TouchableHighlight
                key={i}
                style={{
                  width: 80,
                  height: 30,
                  backgroundColor: '#87f294',
                  margin: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => this.select(i)}
                underlayColor="#40b34f"
              >
                <View borderStyle="solid" borderColor="red" borderWidth="5">
                  <Text style={{ color: '#fff' }}>{month}</Text>
                </View>
              </TouchableHighlight>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    textAlign: 'center',
  },
});
