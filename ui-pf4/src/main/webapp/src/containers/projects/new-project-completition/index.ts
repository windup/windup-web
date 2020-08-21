import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { NewProjectCompletition } from "./new-project-completition";
import { createMapStateToProps } from "../../../store/common";
import { alertActions } from "../../../store/alert";

const mapStateToProps = createMapStateToProps((state) => ({}));

const mapDispatchToProps = {
  addAlert: alertActions.alert,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NewProjectCompletition)
);
