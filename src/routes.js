import Dashboard from "./views/Dashboard.jsx";
// import Notifications from "views/Notifications.jsx";
import ConnectorDetail from "./views/Connector/ConnectorDetail";
import UploadCSV from "./views/UploadCSV";
import SpiderRunFromWeb from "./views/SpiderRunFromWeb";
import LoggerSample from "./views/LoggerSample";
import Logger from "./views/Logger";
import ConnectorAll from "./views/Connector/ConnectorAll";
import ChangePassword from "./views/Auth/ChangePassword";
import NotificationList from "./views/Notifications/NotificationList";
import DetailNotification from "./views/Notifications/DetailNotification";
import {} from 'react-icons/fa'

import {
  ClientList,
  ClientNew,
  ClientEdit,
  ClientConnector
} from "./views/Client";

import{
  ClientAssessorList
} from "./views/ClientAssessor";

import {
  DatabaseCredential,
  DatabaseCredentialNew,
  DatabaseCredentialEdit
} from "./views/Settings";

import {
  SchedulerList,
  SchedulerNew,
  SchedulerEdit
} from "./views/ManagerScheduler";

import RuleInsert from "./views/Rules/RuleInsert";
import ShapeFile from "./views/ShapeFile";
import ClientAssessorNew from "./views/ClientAssessor/ClientAssessorNew";
import DataOriginAssessor from "./views/Assessor/DataOriginAssessor";
import AssessorTaskList from "./views/Assessor/AssessorTaskList";
import AssessorTaskNew from "./views/Assessor/AssessorTaskNew";
import ClientAssessor from "./views/ClientAssessor/ClientAssessor";
import AssessorTaskNextRun from "./views/Assessor/AssessorTaskNextRun";
import React from "react";
import {
  AiFillDatabase, AiOutlineUser
} from "react-icons/ai";
import {
   BiData
} from "react-icons/bi";
import {
   BsListTask
} from "react-icons/bs";

import {
   FaFileExport,
  FaRunning
} from "react-icons/fa";
import {
   FiDownloadCloud,FiUsers
} from "react-icons/fi";
import {
   GrConnect
} from "react-icons/gr";
import {
   HiArchive,
  HiDocumentReport
} from "react-icons/hi";
import ConsSchemaCreate from "./views/Assessor/ConsSchemaCreate";
import {AssessorTaskResult} from "./views/Assessor/AssessorTaskResult";
import AssessorTaskResultDetail from "./views/Assessor/AssessorTaskResultDetail";
import AssessorTaskListDetailInt from "./views/Assessor/AssessorTaskResultDetailInt";


// import LoginForm from "./views/Auth/LoginForm";

const dashboardRoutes = [
  // {
  //   path: "/login",
  //   layout: "/admin",
  //   component: LoginForm,
  //   sidebar: false
  // },
  {
    path: "/notifications",
    layout: "/admin",
    component: NotificationList,
    sidebar: true,
    name: "Notification",
    icon: <HiArchive/>
  },
  {
    path: "/detail/notification",
    layout: "/admin",
    component: DetailNotification,
    sidebar: false
  },
  {
    path: "/logger",
    layout: "/admin",
    component: LoggerSample,
    sidebar: true,
    name: "Review logs",
    icon: <HiDocumentReport/>
  },
  {
    path: "/basic/rule/insert",
    layout: "/admin",
    component: RuleInsert,
    sidebar: false
  },
  {
    path: "/auth/account",
    layout: "/admin",
    component: ChangePassword,
    sidebar: false
  },
  {
    path: "/detail/logger/:id",
    layout: "/admin",
    component: Logger,
    sidebar: false
  },
  // {
  //   path: "/basic/rule",
  //   layout: "/admin",
  //   component: BasicRule,
  //   sidebar: true,
  //   name: "Basic rule",
  //   icon: "pe-7s-switch"
  // },
  {
    path: "/spider",
    layout: "/admin",
    component: SpiderRunFromWeb,
    sidebar: true,
    name: "Run Spider",
    icon: <FaRunning/>
  },
  {
    path: "/clientconnectors/:id",
    layout: "/admin",
    component: ClientConnector,
    sidebar: false
  },
    {
    path: "/task_result/:id",
    layout: "/admin",
    component: AssessorTaskResultDetail,
    sidebar: false
  },
    {
    path: "/task_result_int/:id",
    layout: "/admin",
    component: AssessorTaskListDetailInt,
    sidebar: false
  },
  {
    path: "/csv",
    layout: "/admin",
    component: UploadCSV,
    sidebar: true,
    name: "Csv to Database",
    icon: <FaFileExport/>
  },
  {
    path: "",
    layout: "/#",
    sidebar: true,
    name: "Assessor Stuff",
    icon: <FiUsers/>
  },
  {
    path: "/clientAssessor",
    parent:"Assessor Stuff",
    layout: "/admin",
    component: ClientAssessorList,
    sidebar: true,
    name: "Assessor Clients"
  },
  {
    path: "/taskResult",
    parent:"Assessor Stuff",
    layout: "/admin",
    component: AssessorTaskResult,
    sidebar: true,
    name: "Task Result"
  },
  {
    path: "/assessortask",
    parent:"Assessor Stuff",
    layout: "/admin",
    component: AssessorTaskList,
    sidebar: true,
    name: "List Assessor Tasks",
    icon: <BsListTask/>
  },

  {
    path: "/dataorigin",
    parent:"Assessor Stuff",
    layout: "/admin",
    component: DataOriginAssessor,
    sidebar: true,
    name: "Data Origin Create",
    icon: <AiFillDatabase/>
  },
   {
    path: "/consolidation",
    parent:"Assessor Stuff",
    layout: "/admin",
    component: ConsSchemaCreate,
    sidebar: true,
    name: "Consolidation Schema",
    icon: <BsListTask/>
  },
  {
    path: "/shapefile",
    layout: "/admin",
    component: ShapeFile,
    sidebar: true,
    name: "Download Json Shapefile",
    icon: <FiDownloadCloud/>
  },
  {
    path: "/database",
    name: "Database",
    icon: <BiData/>,
    component: DatabaseCredential,
    layout: "/admin",
    sidebar: true
  },
  {
    path: "/databases/new",
    component: DatabaseCredentialNew,
    layout: "/admin",
    sidebar: false
  },
  {
    path: "/assessor_tasks/next_run",
    layout: "/admin",
    component: AssessorTaskNextRun,
    sidebar: false,
  },
  {
    path: "/databases/credential/edit/:id",
    layout: "/admin",
    component: DatabaseCredentialEdit,
    sidebar: false
  },
  {
    path: "/scheduler/edit/:id",
    layout: "/admin",
    component: SchedulerEdit,
    sidebar: false
  },
  {
    path: "/scheduler/:id",
    layout: "/admin",
    component: SchedulerNew,
    sidebar: false
  },
  {
    path: "/connector/:id",
    layout: "/admin",
    component: ConnectorDetail,
    sidebar: false
  },

  {
    path: "/schedulers/:id",
    layout: "/admin",
    component: SchedulerList,
    sidebar: false
  },
  // {
  //   path: "/connector/kanban",
  //   layout: "/admin",
  //   component: ConnectorKanban,
  //   sidebar: false
  // },
  // {
  //   path: "/connector/status/:id",
  //   layout: "/admin",
  //   component: ConnectorStatus,
  //   sidebar: false
  // },
  {
    path: "/clients/new",
    layout: "/admin",
    component: ClientNew,
    sidebar: false
  },
  {
    path: "/assessor_tasks/new",
    layout: "/admin",
    component: AssessorTaskNew,
    sidebar: false
  },
    {
    path: "/assessor_clients/new",
    layout: "/admin",
    component: ClientAssessorNew,
    sidebar: false
  },
    {
    path: "/assessor_clients/:id",
    layout: "/admin",
    component: ClientAssessor,
    sidebar: false
  },
  {
    path: "/client/:id",
    layout: "/admin",
    component: ClientEdit,
    sidebar: false
  },
  // {
  //   path: "/dashboard",
  //   name: "Dashboard",
  //   icon: "pe-7s-graph",
  //   component: Dashboard,
  //   layout: "/admin",
  //   sidebar: true
  // },
  {
    path: "/clients",
    name: "Clients",
    icon: <AiOutlineUser/>,
    component: ClientList,
    layout: "/admin",
    sidebar: true
  },
  {
    path: "/connectors",
    layout: "/admin",
    component: ConnectorAll,
    sidebar: true,
    icon: <GrConnect/>,
    name: "Connectors"
  }
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   icon: "pe-7s-bell",
  //   component: Notifications,
  //   layout: "/admin",
  //   sidebar: true
  // }
  // {
  //   upgrade: true,
  //   path: "/upgrade",
  //   name: "Upgrade to PRO",
  //   icon: "pe-7s-rocket",
  //   component: Upgrade,
  //   layout: "/admin"
  // }
];

export default dashboardRoutes;
