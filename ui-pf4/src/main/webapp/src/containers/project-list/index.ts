import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { ProjectList } from "./project-list";
import { createMapStateToProps } from "../../store/common";
import {
  projectListSelectors,
  projectListActions,
} from "../../store/projectList";
import { deleteDialogActions } from "../../store/deleteDialog";
import { alertActions } from "../../store/alert";

const mapStateToProps = createMapStateToProps((state) => ({
  projects: projectListSelectors.projects(state),
  error: projectListSelectors.error(state),
  fetchStatus: projectListSelectors.status(state),
}));

const mapDispatchToProps = {
  fetchProjects: projectListActions.fetchProjects,
  showDeleteDialog: deleteDialogActions.openModal,
  closeDeleteDialog: deleteDialogActions.closeModal,
  processingDeleteDialog: deleteDialogActions.processing,
  addAlert: alertActions.alert,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProjectList)
);
