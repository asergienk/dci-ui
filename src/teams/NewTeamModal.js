import React, { Component } from "react";
import { Button, Modal } from "@patternfly/react-core";
import { connect } from "react-redux";
import teamsActions from "./teamsActions";
import TeamForm from "./TeamForm";

export class NewTeamModal extends Component {
  state = {
    canSubmit: false,
    team: {
      name: "",
      external: true,
      state: "active"
    }
  };

  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };

  render() {
    const { isOpen, close, createTeam, onOk } = this.props;
    const { team, canSubmit } = this.state;
    return (
      <Modal
        title={`Create a new team`}
        isOpen={isOpen}
        onClose={close}
        isSmall
        actions={[
          <Button key="cancel" variant="secondary" onClick={close}>
            Cancel
          </Button>,
          <Button
            key="create"
            type="submit"
            disabled={!canSubmit}
            form="team-form"
          >
            Create
          </Button>
        ]}
      >
        <TeamForm
          id="team-form"
          className="pf-c-form"
          team={team}
          onValidSubmit={newTeam => {
            createTeam(newTeam);
            onOk();
          }}
          onValid={this.enableButton}
          onInvalid={this.disableButton}
        />
      </Modal>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createTeam: team => dispatch(teamsActions.create(team))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(NewTeamModal);