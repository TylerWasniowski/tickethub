// @flow
import React from 'react';
import type { Node } from 'react';
import titleCase from 'title-case';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';

type Props = {
  className: string,
  formName: string,
  submitText: string,
  submitRoute: string,
  onSubmit?: any => void,

  children: React.Component | Array<React.Component>,
};

class SimpleForm extends React.Component<Props> {
  constructor(props) {
    super(props);

    this.getFormComponents = this.getFormComponents.bind(this);
    this.createFormComponent = this.createFormComponent.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state: {
    inputValues: Map<string, string | number | boolean>,
  } = {
    inputValues: new Map(),
  };

  getFormComponents(): React.Component {
    const { children } = this.props;

    return React.Children.map(
      children,
      child =>
        child.type.displayName.match(/\(*Input\)*/)
          ? this.createFormComponent(child)
          : child
    );
  }

  createFormComponent(input): FormControl {
    const { id, required, defaultValue, hidden } = input.props;
    const { inputValues } = this.state;

    if (defaultValue) inputValues.set(id, defaultValue);

    if (hidden) return <React.Fragment />;

    return (
      <FormControl margin="normal" required={required} fullWidth>
        <InputLabel htmlFor={id}>{titleCase(id)}</InputLabel>
        <Input onChange={this.handleInputChange} {...input.props} />
      </FormControl>
    );
  }

  handleInputChange(event) {
    const { inputValues } = this.state;
    const { id, value } = event.target;

    inputValues.set(id, value);
  }

  handleSubmit(event) {
    event.preventDefault();
    const { onSubmit, submitRoute } = this.props;
    const { inputValues } = this.state;

    const body = {};
    inputValues.forEach((value, key) => {
      body[key] = value;
    });

    fetch(submitRoute, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(body),
    })
      .then(response => response.json())
      .then(onSubmit)
      .catch(console.log);
  }

  render(): Node {
    const { className, formName, submitText } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <Paper className={`form-container ${className}`}>
          <h1 className="form-title">{formName}</h1>
          <form onSubmit={this.handleSubmit}>
            {this.getFormComponents()}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className="submit-button"
            >
              {submitText}
            </Button>
          </form>
        </Paper>
      </React.Fragment>
    );
  }
}
SimpleForm.defaultProps = { onSubmit: () => {} };

export default SimpleForm;
