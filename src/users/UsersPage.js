import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, DropdownItem, DropdownPosition } from "@patternfly/react-core";
import {
  WarningTriangleIcon,
  EditAltIcon,
  PlusCircleIcon,
} from "@patternfly/react-icons";
import { global_danger_color_100 } from "@patternfly/react-tokens";
import { isEmpty } from "lodash";
import { Page } from "layout";
import usersActions from "./usersActions";
import { CopyButton, EmptyState, KebabDropdown, TextRed } from "ui";
import { getUsers } from "./usersSelectors";

export class UsersPage extends Component {
  componentDidMount() {
    const { fetchUsers } = this.props;
    fetchUsers();
  }

  getDropdownItems = (user) => {
    const { currentUser, deleteUser, history } = this.props;
    const dropdownItems = [
      <DropdownItem
        component="button"
        onClick={() => history.push(`/users/${user.id}`)}
      >
        <EditAltIcon className="mr-xs" /> Edit a user
      </DropdownItem>,
    ];
    if (currentUser.isSuperAdmin) {
      dropdownItems.push(
        <DropdownItem component="button" onClick={() => deleteUser(user)}>
          <WarningTriangleIcon
            color={global_danger_color_100.value}
            className="mr-xs"
          />
          <TextRed>delete a user</TextRed>
        </DropdownItem>
      );
    }
    return dropdownItems;
  };

  render() {
    const { currentUser, users, isFetching, history } = this.props;
    return (
      <Page
        title="Users"
        loading={isFetching && isEmpty(users)}
        empty={!isFetching && isEmpty(users)}
        HeaderButton={
          currentUser.isSuperAdmin ? (
            <Button
              variant="primary"
              onClick={() => history.push("/users/create")}
            >
              <PlusCircleIcon className="mr-xs" />
              Create a new user
            </Button>
          ) : null
        }
        EmptyComponent={
          <EmptyState
            title="There is no users"
            info="Do you want to create one?"
          />
        }
      >
        <table className="pf-c-table pf-m-compact pf-m-grid-md">
          <thead>
            <tr>
              <th>ID</th>
              <th>Login</th>
              <th>Full name</th>
              <th>Email</th>
              <th>Created</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <CopyButton text={user.id} />
                </td>
                <td>{user.name}</td>
                <td>{user.fullname}</td>
                <td>{user.email}</td>
                <td>{user.from_now}</td>
                <td className="pf-c-table__action">
                  <KebabDropdown
                    position={DropdownPosition.right}
                    items={this.getDropdownItems(user)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    users: getUsers(state),
    isFetching: state.users.isFetching,
    currentUser: state.currentUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUsers: () => dispatch(usersActions.all()),
    deleteUser: (user) => dispatch(usersActions.delete(user)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersPage);
