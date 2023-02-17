import React, { useContext } from "react";

import jwtDecode from "jwt-decode";
import history from "context/history";
import { Router } from "react-router";
import { Context } from "context/authContext";
import BeatLoader from "react-spinners/BeatLoader";
import { Switch, Route, Redirect } from "react-router-dom";
import List from "pages/List";
import Home from "pages/Home";
import Login from "pages/Login";
import Expired from "pages/Errors/Expired/expired";
import ResetPassword from "pages/ResetPassword";
import NotFound from "pages/Errors/NotFound/notFound";
import CampaignCreate from "pages/CampaignProfile/CreateData";
import InstitutionSignup from "pages/InstitutionSignup";
import ListInstitutions from "pages/Admin/ListInstitutions";
import CampaignProfileGetData from "pages/CampaignProfile/GetData";
import CampaignProfileUpdateData from "pages/CampaignProfile/UpdateData";
import ViewDataInstitutions from "pages/Admin/ViewDataInstitutions";
import InstitutionProfileGet from "pages/InstitutionProfile/GetData";
import InstitutionProfileUpdate from "pages/InstitutionProfile/UpdateData";
import VisitorCampaign from "pages/Visitor/GetCampaign";
import VisitorInstitution from "pages/Visitor/GetInstitution";

function CustomRoute({ isPrivate, ...rest }) {
  const { loading, authenticated } = useContext(Context);
  if (loading) {
    return (
      <div className="loader">
        <BeatLoader size={30} color={"#42B983"} loading={loading} />
      </div>
    );
  }

  if (isPrivate && !authenticated) {
    return <Redirect to="/login" />;
  }

  return <Route {...rest} />;
}

function AdminRoute({ isPrivate, ...rest }) {
  const { loading, authenticated, haveRole } = useContext(Context);
  if (loading) {
    return (
      <div className="loader">
        <BeatLoader size={30} color={"#42B983"} loading={loading} />
      </div>
    );
  }

  const token = localStorage.getItem("@App:token");
  if (token) {
    const { role } = jwtDecode(token);
    if ((role !== "AD" && !haveRole) || (isPrivate && !authenticated)) {
      return <Redirect to="/login" />;
    }
  } else {
    return <Redirect to="/login" />;
  }

  return <Route {...rest} />;
}

const Routes = () => (
  <Router history={history}>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/login" exact component={Login} />
      <Route path="/account/reset-password" component={ResetPassword} />
      <Route path="/institution-signup" exact component={InstitutionSignup} />
      <CustomRoute
        isPrivate
        exact
        path="/institution/profile"
        component={InstitutionProfileGet}
      />
      <CustomRoute
        isPrivate
        exact
        path="/institution/edit-profile"
        component={InstitutionProfileUpdate}
      />
      <CustomRoute
        isPrivate
        exact
        path="/institution/campaign/create"
        component={CampaignCreate}
      />
      <CustomRoute
        isPrivate
        path="/institution/campaign/:id"
        exact
        component={CampaignProfileGetData}
      />
      <CustomRoute
        isPrivate
        path="/institution/campaign/:id/edit"
        exact
        component={CampaignProfileUpdateData}
      />
      <AdminRoute isPrivate exact path="/admin" component={ListInstitutions} />
      <AdminRoute
        isPrivate
        exact
        path="/admin/:id"
        component={ViewDataInstitutions}
      />
      <Route path="/list" exact component={List} />
      <Route path="/campaign/:id" exact component={VisitorCampaign} />
      <Route path="/institution/:id" exact component={VisitorInstitution} />
      <Route path="/expired" exact component={Expired} />
      <Route path="*" component={NotFound} />
    </Switch>
  </Router>
);

export default Routes;
