import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Panel } from "react-bootstrap";
import { getClientNote, newClientNote } from "../../../api/clients";

class PanelNotes extends Component {
  state = {
    notes: [],
    currentNote: ""
  };

  handleSaveNote = _ => {
    const { currentNote, notes } = this.state;

    if (currentNote) {
      const {
        client: { id }
      } = this.props;

      newClientNote(id, currentNote).then(res => {
        const { data } = res;

        this.setState({ notes: notes.concat(data) });

        this.setState({ currentNote: "" });
      });
    }
  };

  handleChange = e => {
    this.setState({ currentNote: e.target.value });
  };

  componentDidMount() {
    const { client } = this.props;

    getClientNote(client.id).then(res => {
      const { data } = res;
      this.setState({ notes: data.results });
    });
  }

  render() {
    const { notes, currentNote } = this.state;



    const notesMarkup = notes.map(item => {
      return (
        <Panel className="panelNote" key={item.id}>
          <Panel.Body>{item.note}</Panel.Body>
        </Panel>
      );
    });

    return (
      <div className="notesList">
        {notesMarkup}
        <FormGroup>
          <ControlLabel>Note</ControlLabel>
          <FormControl
            rows="5"
            onChange={this.handleChange}
            value={currentNote}
            componentClass="textarea"
            bsClass="form-control"
            name="notes"
          />
        </FormGroup>

        <Button
          className={"btn-fill small"}
          bsStyle="primary"
          onClick={this.handleSaveNote}
        >
          Add note
        </Button>
      </div>
    );
  }
}

export default PanelNotes;
