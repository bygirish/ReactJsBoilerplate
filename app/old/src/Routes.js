import React, { lazy, Suspense, Fragment } from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from '@material-ui/styles';
import { HashLoader } from 'react-spinners';
import MuiTheme from './theme';
// Layout Blueprints


import {
  LeftSidebar,
  MinimalLayout,
  PresentationLayout
} from './layout-blueprints'; 

// Example Pages
//Test changes
import PagesLogin from './pages/Admin/PagesLogin';
import RouteSwitch from 'pages/Admin/Utilities/Transportation/RouteSwitch';


const Dashboard = lazy(() => import('./pages/Admin/Dashboard'));
const Calendar = lazy(() => import('./pages/Admin/Calendar'));
const UserManagement = lazy(() =>
  import('./pages/Admin/UserManagement')
);
const ViewStudentInfoProfile = lazy(() =>
  import('./pages/Admin/Demography/ViewStudentInfoProfile.js')
);
const AddRole = lazy(() =>
  import('./pages/Admin/UserManagement/AddRole.js')
);
const Demography = lazy(() =>
  import('./pages/Admin/Demography')
);

const StudentDemography = lazy(() =>
  import('./pages/Admin/Demography/Student.js')
);
const AddStudent = lazy(() =>
  import('./pages/Admin/Demography/AddStudent.js')
);
const UploadStudents = lazy(() =>
  import('./pages/Admin/Demography/UploadStudents.js')
);
const ViewStudent = lazy(() =>
  import('./pages/Admin/Demography/ViewStudent.js')
);
const ViewStudentInfo = lazy(() =>
  import('./pages/Admin/Demography/ViewStudentInfo.js')
);
const StaffDemography = lazy(() =>
  import('./pages/Admin/Demography/Staff.js')
);
const AddStaff = lazy(() =>
  import('./pages/Admin/Demography/AddStaff.js')
);
const ViewStaff= lazy(() =>
  import('./pages/Admin/Demography/ViewStaff.js')
);
const ViewStaffInfo = lazy(() =>
  import('./pages/Admin/Demography/ViewStaffInfo.js')
);
const ManagementDemography = lazy(() =>
  import('./pages/Admin/Demography/Management.js')
);
const AddManagement = lazy(() =>
  import('./pages/Admin/Demography/AddManagement.js')
);
const ViewManagement= lazy(() =>
  import('./pages/Admin/Demography/ViewManagement.js')
);
const ViewManagementInfo = lazy(() =>
  import('./pages/Admin/Demography/ViewManagementInfo.js')
);
const AlumniDemography = lazy(() =>
  import('./pages/Admin/Demography/Alumni.js')
);
const AddAlumni = lazy(() =>
  import('./pages/Admin/Demography/AddAlumni.js')
);
const ViewAlumni= lazy(() =>
  import('./pages/Admin/Demography/ViewAlumni.js')
);
const ViewAlumniInfo = lazy(() =>
  import('./pages/Admin/Demography/ViewAlumniInfo.js')
);
const Preadmission = lazy(() =>
  import('./pages/Admin/Demography/Preadmission.js')  
);
const PreadmissionSettings = lazy(() => 
  import('./pages/Admin/Demography/PreadmissionSettings.js')
);
const ApplicationAssessment = lazy(() =>
  import('./pages/Admin/Demography/ApplicationAssessment.js') 
);
const AcademicSection = lazy(() =>
  import('./pages/Admin/AcademicSection')
);
const Assignments = lazy(() =>
  import('./pages/Admin/AcademicSection/Assignments.js')
);
const AddViewAssignments = lazy(() =>
  import('./pages/Admin/AcademicSection/AddViewAssignment.js')
);
const Dailydiary = lazy(() =>
  import('./pages/Admin/AcademicSection/Dailydiary.js')
);
const AddViewDailydiary = lazy(() =>
  import('./pages/Admin/AcademicSection/AddViewDailydiary.js')
);
const Circulars = lazy(() =>
  import('./pages/Admin/AcademicSection/Circulars.js')
);
const AddViewCircular = lazy(() =>
  import('./pages/Admin/AcademicSection/AddViewCircular.js')
);
const Projects = lazy(() =>
  import('./pages/Admin/AcademicSection/Projects.js')
);
const AddViewProject = lazy(() =>
  import('./pages/Admin/AcademicSection/AddViewProject.js')
);
const FinancialSection = lazy(() =>
  import('./pages/Admin/FinancialSection')
);
const FeeIncome = lazy(() =>
  import('./pages/Admin/FinancialSection/FeeIncome.js')
);
const FeeMaster = lazy(() =>
  import('./pages/Admin/FinancialSection/FeeMaster.js')
);
const AcademicFeeMaster = lazy(() =>
  import('./pages/Admin/FinancialSection/AcademicFeeMaster.js')
);
const NonAcademicFeeMaster = lazy(() =>
  import('./pages/Admin/FinancialSection/NonAcademicFeeMaster.js')
);
const AcademicFeeCollect = lazy(() =>
  import('./pages/Admin/FinancialSection/AcademicFeeCollect.js')
);
const NonAcademicFeeCollect = lazy(() =>
  import('./pages/Admin/FinancialSection/NonAcademicFeeCollect.js')
);
const ExpenseManagement = lazy(() =>
  import('./pages/Admin/ExpenseManagement')
);
const ExpenseCategories = lazy(() =>
  import('./pages/Admin/ExpenseManagement/ExpenseCategories.js')
);
const AddViewExpense = lazy(() =>
  import('./pages/Admin/ExpenseManagement/AddViewExpense.js')
);
const Gallery = lazy(() =>
  import('./pages/Admin/AcademicSection/Gallery')
);
const AddGallery = lazy(() =>
  import('./pages/Admin/AcademicSection/AddGallery.js')
);
const EditGallery = lazy(() =>
  import('./pages/Admin/AcademicSection/EditGallery.js')
);
const ViewGallery = lazy(() =>
  import('./pages/Admin/AcademicSection/ViewGallery.js')
);
const ExamAttendance = lazy(() =>
  import('./pages/Admin/AcademicSection/ExamAttendance.js')
);
const MarkExamAttendance = lazy(() =>
  import('./pages/Admin/AcademicSection/MarkExamAttendance.js')
);
const Attendance = lazy(() =>
  import('./pages/Admin/AcademicSection/Attendance')
);
const CourseManagement = lazy(() =>
  import('./pages/Admin/AcademicSection/CourseManagement.js')
);
const AddViewWorkdone = lazy(() =>
  import('./pages/Admin/AcademicSection/AddViewWorkdone.js')
);
const AttendanceSettings = lazy(() =>
  import('./pages/Admin/AcademicSection/AttendanceSettings.js')
);
const AttendanceHistory = lazy(() =>
  import('./pages/Admin/AcademicSection/AttendanceHistory.js')
);
const MarkAttendance = lazy(() =>
  import('./pages/Admin/AcademicSection/MarkAttendance.js')
);
const OfflineExamAssessment = lazy(() =>
  import('./pages/Admin/AcademicSection/OfflineExamAssessment')
);
const AddResult = lazy(() =>
  import('./pages/Admin/AcademicSection/AddResult')
);
const ViewResult = lazy(() =>
  import('./pages/Admin/AcademicSection/ViewResult')
);
const OnlineExam = lazy(() =>
  import('./pages/Admin/AcademicSection/OnlineExam.js')
);
const ViewExams = lazy(() =>
  import('./pages/Admin/AcademicSection/ViewExams.js')
);
const ViewResults = lazy(() =>
  import('./pages/Admin/AcademicSection/ViewResults.js')
);
const QuestionBank = lazy(() =>
  import('./pages/Admin/AcademicSection/QuestionBank.js')
);
const AddViewQuestions = lazy(() =>
  import('./pages/Admin/AcademicSection/AddViewQuestions.js')
);
const AddViewQuestionpaper = lazy(() =>
  import('./pages/Admin/AcademicSection/AddViewQuestionpaper.js')
);
const SchedulePlanner = lazy(() =>
  import('./pages/Admin/SchedulePlanner')
);
const Holiday = lazy(() =>
  import('./pages/Admin/SchedulePlanner/Holidays.js')
);
const AddViewHoliday = lazy(() =>
  import('./pages/Admin/SchedulePlanner/AddViewHoliday.js')
);
const Events = lazy(() =>
  import('./pages/Admin/SchedulePlanner/Events.js')
);
const AddViewEvent = lazy(() =>
  import('./pages/Admin/SchedulePlanner/AddViewEvent.js')
);
const Timetable = lazy(() =>
  import('./pages/Admin/SchedulePlanner/Timetable.js')
);
const TimetableSettings = lazy(() =>
  import('./pages/Admin/SchedulePlanner/TimetableSettings.js')
);

const StudentTimatable = lazy(() =>
  import('./pages/Admin/SchedulePlanner/StudentTimatable.js')
);
const StaffTimatable = lazy(() =>
  import('./pages/Admin/SchedulePlanner/StaffTimetable.js')
);
const Communication = lazy(() =>
  import('./pages/Admin/Communication')
);
const MessageCenter = lazy(() =>
  import('./pages/Admin/Communication/MessageCenter.js')
);
const SendViewMessage = lazy(() =>
  import('./pages/Admin/Communication/SendViewMessage.js')
);
const Feedback = lazy(() =>
  import('./pages/Admin/Communication/Feedback.js')
);
const Utilities = lazy(() =>
  import('./pages/Admin/Utilities')
);
const DocumentManagement = lazy(() =>
  import('./pages/Admin/Utilities/DocumentManagement.js')
);
const AddViewDocket = lazy(() =>
  import('./pages/Admin/Utilities/AddViewDocket.js')
);
const LeaveManagement = lazy(() =>
  import('./pages/Admin/Utilities/LeaveManagement.js')
);
const LibraryManagement = lazy(() =>
  import('./pages/Admin/Utilities/LibraryManagement.js')
);
const LibrarySettings = lazy(() =>
  import('./pages/Admin/Utilities/LibrarySettings.js')
);
const AddViewBooks = lazy(() =>
  import('./pages/Admin/Utilities/AddViewBooks.js')
);
const BookCirculation = lazy(() =>
  import('./pages/Admin/Utilities/BookCirculation.js')
);
const ApplyLeave = lazy(() =>
  import('./pages/Admin/Utilities/ApplyLeave.js')
);
const LeaveTypes = lazy(() =>
  import('./pages/Admin/Utilities/LeaveTypes.js')
);
const ViewApplication = lazy(() =>
  import('./pages/Admin/Utilities/ViewApplication.js')
);
const CSTR = lazy(() =>
  import('./pages/Admin/CSTR')
);
const ClassMaster = lazy(() =>
  import('./pages/Admin/CSTR/ClassMaster.js')
);

const TeacherMaster = lazy(() =>
  import('./pages/Admin/CSTR/TeacherMaster.js')
);
const SubjectMaster = lazy(() =>
  import('./pages/Admin/CSTR/SubjectMaster.js')
);
const RoomMaster = lazy(() =>
  import('./pages/Admin/CSTR/RoomMaster.js')
);
const ExamSchedule = lazy(() =>
  import('./pages/Admin/ExamSchedule')
);
const ExamMaster = lazy(() =>
  import('./pages/Admin/ExamSchedule/ExamMaster.js')
);
const ExamTimetable = lazy(() =>
  import('./pages/Admin/ExamSchedule/ExamTimetable.js')
);
const Hostel = lazy(() => 
  import('./pages/Admin/Utilities/Hostel')
);
const RoomFeeMaster = lazy(() => 
  import('./pages/Admin/Utilities/Hostel/RoomFeeMaster')
);
const ViewRoomFeeMaster = lazy(() => 
  import('./pages/Admin/Utilities/Hostel/RoomFeeMaster/ViewRoomFee.js')
);
const EditRoomFeeMaster = lazy(() => 
  import('./pages/Admin/Utilities/Hostel/RoomFeeMaster/EditRoomFee.js')
);
const ViewFoodFeeMaster = lazy(() => 
  import('./pages/Admin/Utilities/Hostel/RoomFeeMaster/ViewFoodFee.js')
);
const EditFoodFeeMaster = lazy(() => 
  import('./pages/Admin/Utilities/Hostel/RoomFeeMaster/EditFoodFee.js')
);
const HostelEntryExit = lazy(() => 
  import('./pages/Admin/Utilities/Hostel/HostelEntryExit')
);
const DailyActivities = lazy(() =>
  import('./pages/Admin/Utilities/Hostel/DailyActivities')
);
const StaffAllocation = lazy(() =>
  import('./pages/Admin/Utilities/Hostel/StaffAllocation')
);
const AddRoomToFloor = lazy(() =>
  import('./pages/Admin/Utilities/Hostel/RoomFeeMaster/AddRooms.js')
);
const ViewBlockRooms = lazy(() => 
  import('./pages/Admin/Utilities/Hostel/RoomFeeMaster/ViewBlockRooms.js')
);
const StudentRoomAllocation = lazy(() => 
  import('./pages/Admin/Utilities/Hostel/HostelEntryExit/StudentRoomAllocation.js')
)
const StudentJoiningRoom = lazy(() =>
  import('./pages/Admin/Utilities/Hostel/HostelEntryExit/StudentRoomJoining.js')
);
const HostelEntryRecipt = lazy(() =>
  import('./pages/Admin/Utilities/Hostel/HostelEntryExit/HostelEntryRecipt.js')
);
const StafftoHostelAllocation = lazy(() =>
  import('./pages/Admin/Utilities/Hostel/StaffAllocation/StafftoHostelAllocation.js')
);
const ViewHostelLeaveApplication = lazy(() =>
  import('./pages/Admin/Utilities/Hostel/DailyActivities/ViewHostelLeaveApplication.js')
);
const ViewVisitorRequest = lazy(() =>
  import('./pages/Admin/Utilities/Hostel/DailyActivities/ViewVisitorRequest.js')
);
const ViewGuestRequest = lazy(() =>
  import('./pages/Admin/Utilities/Hostel/DailyActivities/ViewGuestRequest.js')
);
const ViewReallocationRequest = lazy(() =>
  import('./pages/Admin/Utilities/Hostel/DailyActivities/ViewReallocationRequest.js')
);
const ViewRostering = lazy(() =>
  import('./pages/Admin/Utilities/Hostel/StaffAllocation/ViewRostering.js')
);
const IndividualHosttile = lazy(() =>
  import('./pages/Admin/Utilities/Hostel/IndividualHostellite.js')
);
const GetRostering = lazy(() =>
  import('./pages/Admin/Utilities/Hostel/StaffAllocation/GetRostering.js')
);
const ViewReallocationHistory = lazy(() =>
  import('./pages/Admin/Utilities/Hostel/DailyActivities/ViewReallocationHistory.js')
);
const VisitorsManagement = lazy(() => 
  import('./pages/Admin/Utilities/VisitorsManagement')
);
const WaitingVisitors = lazy(() =>
  import('./pages/Admin/Utilities/VisitorsManagement/WaitingVisitors.js')
);
const TodaysVisitors = lazy(() =>
  import('./pages/Admin/Utilities/VisitorsManagement/TodaysVisitors.js')
);
const WeeklyVisitor = lazy(() =>
  import('./pages/Admin/Utilities/VisitorsManagement/WeeklyVisitor.js')
);
const ScheduledVisitors = lazy(() =>
  import('./pages/Admin/Utilities/VisitorsManagement/ScheduledVisitors.js')
);
const AddVisitorsData = lazy(() =>
  import('./pages/Admin/Utilities/VisitorsManagement/AddVisitorsData.js')
);
const AddScheduledData = lazy(() =>
  import('./pages/Admin/Utilities/VisitorsManagement/AddScheduledData.js')
);
const VisitorsReport = lazy(() =>
  import('./pages/Admin/Utilities/VisitorsManagement/VisitorsReport.js')
);
const ViewVisitDetils = lazy(() =>
  import('./pages/Admin/Utilities/VisitorsManagement/ViewVisitDetils.js')
);
const ViewAllVisitors = lazy(() =>
  import('./pages/Admin/Utilities/VisitorsManagement/ViewAllVisitors.js')
);
const EditScheduledVisit = lazy(() =>
  import('./pages/Admin/Utilities/VisitorsManagement/EditScheduledVisit.js')
);
const CancelScheduleVisit = lazy(() =>
  import('./pages/Admin/Utilities/VisitorsManagement/CancelScheduleVisit.js')
);
const EditVisitDetail = lazy(() =>
  import('./pages/Admin/Utilities/VisitorsManagement/EditVisitDetail.js')
);
const CancelVisit = lazy(() =>
  import('./pages/Admin/Utilities/VisitorsManagement/CancelVisit.js')
);
const CheckInVisit = lazy(() =>
  import('./pages/Admin/Utilities/VisitorsManagement/CheckInVisit.js')
);

const Transportation = lazy(() =>
  import('./pages/Admin/Utilities/Transportation')
);
const Certificates = lazy(() =>
  import('./pages/Admin/Certificates')
);
const TransferCertificate = lazy(() =>
  import('./pages/Admin/Certificates/TransferCertificate.js')
);
const StudyCertificate = lazy(() =>
  import('./pages/Admin/Certificates/StudyCertificate.js')
);

const Reports = lazy(() =>
  import('./pages/Admin/Reports') 
);
const Settings = lazy(() =>
  import('./pages/Admin/Settings')
);
const AcademicSettings = lazy(() =>
  import('./pages/Admin/Settings/AcademicCalendar.js')
);
const Organization = lazy(() =>
  import('./pages/Admin/Settings/Organization.js')
);
const AcademicYear = lazy(() =>
  import('./pages/Admin/Settings/AcademicYear.js')
);
const MasterData = lazy(() =>
  import('./pages/Admin/Settings/MasterData.js')
);
const MasterDataBoard = lazy(() =>
  import('./pages/Admin/Settings/MasterDataBoard.js')
);
const MasterDataCourse = lazy(() =>
  import('./pages/Admin/Settings/MasterDataCourse.js')
);
const MasterDataStream = lazy(() =>
  import('./pages/Admin/Settings/MasterDataStream.js')
);
const MasterDataCombination = lazy(() =>
  import('./pages/Admin/Settings/MasterDataCombination.js')
);
const Institutions = lazy(() =>
  import('./pages/Admin/Settings/Institutions.js')
);
const AddInstitutions = lazy(() =>
  import('./pages/Admin/Settings/AddInstitutions.js')
);
const ViewInstitutions = lazy(() =>
  import('./pages/Admin/Settings/ViewInstitutions.js')
);
const Stream = lazy(() =>
  import('./pages/Admin/Settings/Stream.js')
);
const Board = lazy(() =>
  import('./pages/Admin/Settings/Board.js')
);
const FleetManagement = lazy(() =>
  import('./pages/Admin/Utilities/Transportation/FleetManagement/index.js')
);
const FuelExpenses = lazy(() =>
  import('./pages/Admin/Utilities/Transportation/FleetManagement/FuelExpenses.js')
);
const VehicleMaintainance = lazy(() =>
  import('./pages/Admin/Utilities/Transportation/FleetManagement/VehicleMaintainance.js')
);

const Roastering = lazy(() =>
  import('./pages/Admin/Utilities/Transportation/FleetManagement/Roastering.js')
);
const RoleMaster = lazy(() =>
  import('./pages/Admin/Utilities/Transportation/FleetManagement/RoleMaster.js')
);
const StaffOverview = lazy(() =>
  import('./pages/Admin/Utilities/Transportation/FleetManagement/StaffOverview.js')
);
const StaffToRoll = lazy(() =>
  import('./pages/Admin/Utilities/Transportation/FleetManagement/StaffToRoll.js')
);
const StaffToVehicle = lazy(() =>
  import('./pages/Admin/Utilities/Transportation/FleetManagement/StaffToVehicle.js')
);
const VehicleMaster = lazy(() =>
  import('./pages/Admin/Utilities/Transportation/FleetManagement/VehicleMaster.js')
);
const RouteFeeMaster = lazy(() =>
  import('./pages/Admin/Utilities/Transportation/RouteFeeMaster/index.js')
);
const RouteMapStops = lazy(() =>
  import('./pages/Admin/Utilities/Transportation/RouteFeeMaster/RouteMapStops.js')
);
const StudentRouteBus = lazy(() =>
  import('./pages/Admin/Utilities/Transportation/StudentRouteBus/index.js')
);
const StudentRoute = lazy(() =>
  import('./pages/Admin/Utilities/Transportation/StudentRouteBus/StudentRoute.js')
);
const TransportationRouteSwitch = lazy(() =>
  import('./pages/Admin/Utilities/Transportation/RouteSwitch/index.js')
);
const AddPreadmission = lazy(() =>
  import('./pages/Admin/Demography/AddPreadmission.js')
);
const ViewApplicationAssessments = lazy(() =>
  import('./pages/Admin/Demography/ViewApplicationAssessments.js')
);
const PreadmissionStudentInfo = lazy(() => 
  import('./pages/Admin/Demography/PreadmissionStudentInfo.js') 
);
const AcademicReports = lazy(() => 
  import('./pages/Admin/Reports/AcademicReports.js')
);
const AttendanceReport = lazy(() =>
  import('./pages/Admin/Reports/AttendanceReport.js') 
);
const StaffAttendanceReport = lazy(() => 
  import('./pages/Admin/Reports/StaffAttendanceReport.js') 
);
const TcReport = lazy(() => 
  import('./pages/Admin/Reports/TcReport.js')
);
const StudentDailyAbsentReport = lazy(() => 
  import('./pages/Admin/Reports/StudentDailyAbsentReport.js')
);
const StaffDailyAbsentReport = lazy(() => 
  import('./pages/Admin/Reports/StaffDailyAbsentReport.js')
);
const UploadStaffs = lazy(() => 
  import('./pages/Admin/Demography/UploadStaffs.js') 
);
const LiveClass = lazy(() =>
  import('./pages/Admin/LiveClass')
);
const Editpreadmission = lazy(() =>
  import('./pages/Admin/Demography/Editpreadmission.js')
);


const Routes = () => {
  const location = useLocation(); 

  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.99
    },
    in: {
      opacity: 1,
      scale: 1
    },
    out: {
      opacity: 0,
      scale: 1.01
    }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  };

  const SuspenseLoading = () => {
    return (
      <Fragment>
        <div className="d-flex align-items-center flex-column vh-100 justify-content-center text-center py-3">
          <div className="d-flex align-items-center flex-column px-4">
            <HashLoader color={'#5383ff'} loading={true} />
          </div>
          <div className="text-muted font-size-xl text-center pt-3">
            Please wait while we load the page
          </div>
        </div>
      </Fragment>
    );
  };
  return (
    <ThemeProvider theme={MuiTheme}>
      <AnimatePresence>
        <Suspense fallback={<SuspenseLoading />}>
          <Switch>
            <Redirect exact from="/" to="/login" />
            <Route path={['/login']}>
              <PresentationLayout>
                <Switch location={location} key={location.pathname}>
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}>
                    <Route path="/login" component={PagesLogin} />
                  </motion.div>
                </Switch>
              </PresentationLayout>
            </Route>
            <Route
              path={[
                '/login'
              ]}>
              <MinimalLayout>
                <Switch location={location} key={location.pathname}>
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}>
                    <Route path="/login" component={PagesLogin} />
                  </motion.div>
                </Switch>
              </MinimalLayout>
            </Route>

            <Route
              path={[
                '/admin/dashboard',
                '/admin/template-settings',
                '/admin/calendar',
                '/admin/user-management',
                '/admin/add-role',
                '/admin/demography',
                '/admin/student',
                '/admin/add-student',
                '/admin/upload-students',
                '/admin/view-student',
                '/admin/view-student-info',
                '/admin/staff',
                '/admin/add-staff',
                '/admin/view-staff',
                '/admin/view-staff-info',
                '/admin/management',
                '/admin/add-management',
                '/admin/view-management',
                '/admin/view-management-info',
                '/admin/alumni',
                '/admin/add-alumni',
                '/admin/view-alumni',
                '/admin/view-alumni-info',
                '/admin/preadmission',
                '/admin/preadmission-settings',
                '/admin/application-assessment',
                '/admin/academic-section',
                '/admin/assignments',
                '/admin/add-view-assignment',
                '/admin/dailydiary',
                '/admin/add-view-dailydiary',
                '/admin/circular',
                '/admin/add-view-circular',
                '/admin/project',
                '/admin/add-view-project',
                '/admin/financial-section',
                '/admin/feeincome',
                '/admin/feemaster',
                '/admin/academic-feemaster',
                '/admin/nonacademic-feemaster',
                '/admin/academic-feecollect',
                '/admin/nonacademic-feecollect',
                '/admin/expense-management',
                '/admin/expense-categories',
                '/admin/add-view-expense',
                '/admin/gallery',
                '/admin/add-gallery',
                '/admin/edit-gallery',
                '/admin/view-gallery',
                '/admin/exam-attendance',
                '/admin/mark-exam-attendance',
                '/admin/attendance',
                '/admin/attendance-settings',
                '/admin/attendance-history',
                '/admin/mark-attendance',
                '/admin/offline-exam-assessment',
                '/admin/add-result',
                '/admin/view-result',
                '/admin/online-exam',
                '/admin/view-exams',
                '/admin/view-results',
                '/admin/question-bank',
                '/admin/add-view-questions',
                '/admin/add-view-question-paper',
                '/admin/course-management',
                '/admin/add-view-workdone',
                '/admin/schedule-planner',
                '/admin/holidays',
                '/admin/add-view-holiday',
                '/admin/events',
                '/admin/add-view-event',
                '/admin/timetable',
                '/admin/timetable-settings',
                '/admin/student-timetable',
                '/admin/staff-timetable',
                '/admin/communications',
                '/admin/messagecenter',
                '/admin/send-view-message',
                '/admin/feedback',
                '/admin/utilities',
                '/admin/document-management',
                '/admin/add-view-docket',
                '/admin/cstrmodule',
                '/admin/class-master',
                '/admin/subject-master',
                '/admin/room-master',
                '/admin/library-management',
                '/admin/library-settings',
                '/admin/add-view-books',
                '/admin/book-circulation',
                '/admin/leave-management',
                '/admin/apply-leave',
                '/admin/leave-types',
                '/admin/view-applications',
                '/admin/cstrmodule',
                '/admin/class-master',
                '/admin/subject-master',
                '/admin/teacher-master',
                '/admin/room-master',
                '/admin/exam-schedule',
                '/admin/exam-timetable',
                '/admin/exam-master',
                '/admin/exam-timetable',
                '/admin/hostel-management',
                '/admin/room-fee-master',
                '/admin/view-room-fee-master',
                '/admin/edit-room-fee-master',
                '/admin/view-food-fee-master',
                '/admin/edit-food-fee-master',
                '/admin/hostel-entry-exit',
                '/admin/daily-activities',
                '/admin/staff-allocation',
                '/admin/add-rooms-to-floors',
                '/admin/view-block-rooms-master',
                '/admin/view-block-roomsfood-master',
                '/admin/student-room-allocation',
                '/admin/student-room-joining',
                '/admin/student-room-allocation-recipt',
                '/admin/staff-to-hostel-allocation',
                '/admin/view-hostel-leave-application',
                '/admin/view-visitor-request',
                '/admin/view-guest-request',
                '/admin/view-reallocation-request',
                '/admin/view-rostering/',
                '/admin/individual-hostellite-data',
                '/admin/get-rostering',
                '/admin/view-reallocation-history',
                '/admin/visitors-management',
                '/admin/view-waiting-visitors',
                '/admin/view-todays-visitor',
                '/admin/view-weekly-visitor',
                '/admin/scheduled-visitors',
                '/admin/add-visitor-data',
                '/admin/add-scheduled-data',
                '/admin/reports',
                '/admin/view-visit-details/',
                '/admin/view-visitor-data',
                '/admin/edit-scheduled-visit/',
                '/admin/cancel_schedule-visit/',
                '/admin/edit-visit-detail/',
                '/admin/cancel-visit/',
                '/admin/check-in-visit/',
                '/admin/student-room-allocation-recipt/',
                '/admin/Transportation-management',
                '/admin/Fleet-management',
                '/admin/fuel-expenses',
                '/admin/rostering',
                '/admin/role-master',
                '/admin/staff-overview',
                '/admin/staff-to-roll',
                '/admin/staff-to-vehicle',
                '/admin/vehicle-master', 
                '/admin/RouteFee-Master',
                '/admin/route-map-stops',
                '/admin/student-route-bus',
                '/admin/student-route',
                '/admin/transportation-route-switch',
                '/admin/certificates',
                '/admin/transfer-certificate',
                '/admin/study-certificate',
                '/admin/visitor-reports',
                '/admin/settings',
                '/admin/academic-settings',
                '/admin/organization',
                '/admin/vehicle-maintainance',
                '/admin/add-application-assessment',
                '/admin/view-application-assessments/',
                '/admin/preadmission-student-info/',
                '/admin/academic-reports',
                '/admin/attendance-report',
                '/admin/staff-report',
                '/admin/tc-report', 
                '/admin/student-daily-absent-report',
                '/admin/staff-daily-absent-report',
                '/admin/Institutions',
                '/admin/Board',
                '/admin/Stream',
                '/admin/upload-staff',
                '/admin/my-profile',
                '/admin/live-path',
                '/admin/edit-preadmission',
                '/admin/add-Institution',
                '/admin/view-Institution',
                '/admin/academic-year',
                '/admin/master-data',
                '/admin/master/board/add',
                '/admin/master/course/add',
                '/admin/master/stream/add',
                '/admin/master/combination/add',
              ]}>
              <LeftSidebar>
                <Switch location={location} key={location.pathname}>
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}>
                    <Route
                      path="/admin/dashboard"
                      component={Dashboard}
                    />
                     {/* <Route
                      path="/admin/template-settings"
                      component={TemplateSettings}
                    /> */}
                    {/* <Route
                      path="/admin/template-settings"
                      component={TemplateSettings}
                    />*/}
                     <Route
                      path="/admin/calendar"
                      component={Calendar}
                    />
                    <Route
                      path="/admin/user-management"
                      component={UserManagement}
                    />
                     <Route
                      path="/admin/add-role"
                      component={AddRole}
                    />
                      <Route
                      path="/admin/demography"
                      component={Demography}
                    />
                     <Route
                      path="/admin/student"
                      component={StudentDemography}
                    />
                    <Route
                      path="/admin/add-student"
                      component={AddStudent}
                    />
                      <Route
                      path="/admin/upload-students"
                      component={UploadStudents}
                    />
                    <Route
                      path="/admin/view-student"
                      component={ViewStudent}
                    />
                    <Route
                      path="/admin/view-student-info"
                      component={ViewStudentInfo}
                    />
                      <Route
                      path="/admin/staff"
                      component={StaffDemography}
                    />
                    <Route
                      path="/admin/add-staff"
                      component={AddStaff}
                    />
                    <Route
                      path="/admin/view-staff"
                      component={ViewStaff}
                    />
                    <Route
                      path="/admin/view-staff-info"
                      component={ViewStaffInfo}
                    />
                        <Route
                      path="/admin/management"
                      component={ManagementDemography}
                    />
                    <Route
                      path="/admin/add-management"
                      component={AddManagement}
                    />
                    <Route
                      path="/admin/view-management"
                      component={ViewManagement}
                    />
                    <Route
                      path="/admin/view-management-info"
                      component={ViewManagementInfo}
                    />
                      <Route
                      path="/admin/alumni"
                      component={AlumniDemography}
                    />
                    <Route
                      path="/admin/add-alumni"
                      component={AddAlumni}
                    />
                    <Route
                      path="/admin/view-alumni"
                      component={ViewAlumni}
                    />
                    <Route
                      path="/admin/view-alumni-info"
                      component={ViewAlumniInfo}
                    />
                     <Route
                      path="/admin/preadmission"
                      component={Preadmission}
                    />
                    <Route
                      path="/admin/preadmission-settings"
                      component={PreadmissionSettings}
                    />
                     <Route
                      path="/admin/application-assessment"
                      component={ApplicationAssessment}
                    />
                     <Route
                      path="/admin/academic-section"
                      component={AcademicSection}
                    />
                    <Route
                      path="/admin/assignments"
                      component={Assignments}
                    />
                     <Route
                      path="/admin/add-view-assignment"
                      component={AddViewAssignments}
                    />
                     <Route
                      path="/admin/dailydiary"
                      component={Dailydiary}
                    />
                     <Route
                      path="/admin/add-view-dailydiary"
                      component={AddViewDailydiary}
                    />
                      <Route
                      path="/admin/circular"
                      component={Circulars}
                    />
                     <Route
                      path="/admin/add-view-circular"
                      component={AddViewCircular}
                    />
                      <Route
                      path="/admin/project"
                      component={Projects}
                    />
                     <Route
                      path="/admin/add-view-project"
                      component={AddViewProject}
                    />
                     <Route
                      path="/admin/course-management"
                      component={CourseManagement}
                    />
                      <Route
                      path="/admin/add-view-workdone"
                      component={AddViewWorkdone}
                    />
                     <Route
                      path="/admin/financial-section"
                      component={FinancialSection}
                    />
                    <Route
                      path="/admin/feeincome"
                      component={FeeIncome}
                    />
                     <Route
                      path="/admin/feemaster"
                      component={FeeMaster}
                    />
                     <Route
                      path="/admin/academic-feemaster"
                      component={AcademicFeeMaster}
                    />
                     <Route
                      path="/admin/nonacademic-feemaster"
                      component={NonAcademicFeeMaster}
                    />
                     <Route
                      path="/admin/academic-feecollect"
                      component={AcademicFeeCollect}
                    />
                     <Route
                      path="/admin/nonacademic-feecollect"
                      component={NonAcademicFeeCollect}
                    />
                     <Route
                      path="/admin/expense-management"
                      component={ExpenseManagement}
                    />
                      <Route
                      path="/admin/expense-categories"
                      component={ExpenseCategories}
                    />
                       <Route
                      path="/admin/add-view-expense"
                      component={AddViewExpense}
                    />
                      <Route
                      path="/admin/gallery"
                      component={Gallery}
                    />
                      <Route
                      path="/admin/add-gallery"
                      component={AddGallery}
                    />
                     <Route
                      path="/admin/edit-gallery"
                      component={EditGallery}
                    />
                     <Route
                      path="/admin/view-gallery"
                      component={ViewGallery}
                    />
                      <Route
                      path="/admin/exam-attendance"
                      component={ExamAttendance}
                    />
                     <Route
                      path="/admin/mark-exam-attendance"
                      component={MarkExamAttendance}
                    />
                      <Route
                      path="/admin/attendance"
                      component={Attendance}
                    />
                      <Route
                      path="/admin/attendance-settings"
                      component={AttendanceSettings}
                    />
                     <Route
                      path="/admin/attendance-history"
                      component={AttendanceHistory}
                    />
                    <Route
                      path="/admin/mark-attendance"
                      component={MarkAttendance}
                    />
                      <Route 
                      path="/admin/offline-exam-assessment"
                      component={OfflineExamAssessment}
                    />
                    <Route 
                      path="/admin/add-result"
                      component={AddResult}
                    />
                     <Route 
                      path="/admin/view-result"
                      component={ViewResult}
                    />
                     <Route
                      path="/admin/online-exam"
                      component={OnlineExam}
                    />
                     <Route
                      path="/admin/view-exams"
                      component={ViewExams}
                    />
                     <Route
                      path="/admin/view-results"
                      component={ViewResults}
                    />
                      <Route
                      path="/admin/question-bank"
                      component={QuestionBank}
                    />
                    <Route
                      path="/admin/add-view-questions"
                      component={AddViewQuestions}
                    />
                    <Route
                      path="/admin/add-view-question-paper"
                      component={AddViewQuestionpaper}
                    />
                      <Route
                      path="/admin/schedule-planner"
                      component={SchedulePlanner}
                    />
                     <Route
                      path="/admin/holidays"
                      component={Holiday}
                    />
                     <Route
                      path="/admin/add-view-holiday"
                      component={AddViewHoliday}
                    />
                      <Route
                      path="/admin/events"
                      component={Events}
                    />
                     <Route
                      path="/admin/add-view-event"
                      component={AddViewEvent}
                    />
                    <Route
                      path="/admin/timetable"
                      component={Timetable}
                    />
                      <Route
                      path="/admin/timetable-settings"
                      component={TimetableSettings}
                    />
                    <Route
                      path="/admin/student-timetable"
                      component={StudentTimatable}
                    />
                     <Route
                      path="/admin/staff-timetable"
                      component={StaffTimatable}
                    />
                    <Route
                      path="/admin/communications"
                      component={Communication}
                    />
                    <Route
                      path="/admin/messagecenter"
                      component={MessageCenter}
                    />
                    <Route
                      path="/admin/send-view-message"
                      component={SendViewMessage}
                    />
                     <Route
                      path="/admin/feedback"
                      component={Feedback}
                    />
                    <Route
                      path="/admin/utilities"
                      component={Utilities}
                    />
                    <Route
                      path="/admin/document-management"
                      component={DocumentManagement}
                    />
                     <Route
                      path="/admin/add-view-docket"
                      component={AddViewDocket}
                    />
                      <Route
                      path="/admin/library-management"
                      component={LibraryManagement}
                    />
                       <Route
                      path="/admin/library-settings"
                      component={LibrarySettings}
                    />
                       <Route
                      path="/admin/add-view-books"
                      component={AddViewBooks}
                    />
                      <Route
                      path="/admin/book-circulation"
                      component={BookCirculation}
                    />
                      <Route
                      path="/admin/leave-management"
                      component={LeaveManagement}
                    />
                     <Route
                      path="/admin/apply-leave"
                      component={ApplyLeave}
                    />
                       <Route
                      path="/admin/leave-types"
                      component={LeaveTypes}
                    />
                       <Route
                      path="/admin/view-applications"
                      component={ViewApplication}
                    />
                    <Route
                      path="/admin/cstrmodule"
                      component={CSTR}
                    />
                     <Route
                      path="/admin/class-master"
                      component={ClassMaster}
                    />
                      <Route
                      path="/admin/subject-master"
                      component={SubjectMaster}
                    />

                    <Route
                      path="/admin/room-master"
                      component={RoomMaster}
                    />

                      <Route
                      path="/admin/teacher-master"
                      component={TeacherMaster}
                    />
                      <Route
                      path="/admin/room-master"
                      component={RoomMaster}
                    />
                     <Route
                      path="/admin/exam-schedule"
                      component={ExamSchedule}
                    />
                     <Route
                      path="/admin/exam-master"
                      component={ExamMaster}
                    />
                     <Route
                      path="/admin/exam-timetable"
                      component={ExamTimetable}
                    />
                    <Route
                      path="/admin/hostel-management"
                      component={Hostel}
                    />
                    <Route
                      path="/admin/room-fee-master"
                      component={RoomFeeMaster}
                    />
                    <Route
                      path="/admin/view-room-fee-master"
                      component = {ViewRoomFeeMaster}
                    />
                    <Route
                      path="/admin/edit-room-fee-master"
                      component={EditRoomFeeMaster}
                    />
                    <Route
                      path="/admin/view-food-fee-master"
                      component={ViewFoodFeeMaster}
                    />
                    <Route
                      path="/admin/edit-food-fee-master"
                      component={EditFoodFeeMaster}
                    />
                    <Route
                      path="/admin/hostel-entry-exit"
                      component={HostelEntryExit}
                    />
                    <Route 
                      path="/admin/daily-activities"
                      component={DailyActivities}
                    />
                    <Route
                      path="/admin/staff-allocation"
                      component={StaffAllocation} 
                    />
                    <Route 
                      path="/admin/add-rooms-to-floors"
                      component={AddRoomToFloor}
                    />
                     <Route 
                      path="/admin/certificates"
                      component={Certificates}
                    />
                     
                      <Route 
                      path="/admin/transfer-certificate"
                      component={TransferCertificate}
                    />
                      <Route 
                      path="/admin/study-certificate"
                      component={StudyCertificate}
                    />
                     <Route 
                      path="/admin/reports"
                      component={Reports}
                    />
                     <Route 
                      path="/admin/settings"
                      component={Settings}
                    />
                     <Route 
                      path="/admin/academic-settings"
                      component={AcademicSettings}
                    />
                     <Route 
                      path="/admin/organization"
                      component={Organization}
                    />
                    <Route 
                      path="/admin/view-block-rooms-master"
                      component={ViewBlockRooms}
                    />
                    <Route
                      path="/admin/student-room-allocation"
                      component={StudentRoomAllocation}
                    />
                    <Route
                      path="/admin/student-room-joining/"
                      component={StudentJoiningRoom}
                    />
                    <Route
                      path="/admin/student-room-allocation-recipt/"
                      component={HostelEntryRecipt}
                    />
                    <Route
                      path="/admin/staff-to-hostel-allocation/"
                      component={StafftoHostelAllocation}
                    />
                    <Route
                      path="/admin/view-hostel-leave-application/"
                      component={ViewHostelLeaveApplication}
                    />
                    <Route
                      path="/admin/view-visitor-request/"
                      component={ViewVisitorRequest}
                    />
                    <Route
                      path="/admin/view-guest-request/"
                      component={ViewGuestRequest}
                    />
                    <Route
                      path="/admin/view-reallocation-request/"
                      component={ViewReallocationRequest}
                    />
                    <Route
                      path="/admin/view-rostering/"
                      component={ViewRostering}
                    />
                    <Route
                      path="/admin/individual-hostellite-data"
                      component={IndividualHosttile}
                    />
                    <Route
                      path="/admin/get-rostering/"
                      component={GetRostering}
                    />
                    <Route
                      path="/admin/view-reallocation-history"
                      component={ViewReallocationHistory}
                    />
                    <Route
                      path="/admin/visitors-management"
                      component={VisitorsManagement}
                    />
                    <Route 
                      path="/admin/view-waiting-visitors"
                      component={WaitingVisitors}
                    />
                    <Route
                      path="/admin/view-todays-visitor"
                      component={TodaysVisitors}
                    />
                    <Route
                      path="/admin/view-weekly-visitor"
                      component={WeeklyVisitor}
                    />
                    <Route
                      path="/admin/scheduled-visitors"
                      component={ScheduledVisitors} 
                    />
                    <Route
                      path="/admin/add-visitor-data" 
                      component={AddVisitorsData}
                    />
                    <Route
                      path="/admin/add-scheduled-data"
                      component={AddScheduledData}
                    />
                    <Route
                      path="/admin/visitor-reports"
                      component={VisitorsReport}
                    />
                    <Route 
                      path="/admin/view-visit-details/"
                      component={ViewVisitDetils}
                    />
                    <Route
                      path="/admin/view-visitor-data"
                      component={ViewAllVisitors}
                    />
                    <Route
                      path="/admin/edit-scheduled-visit/"
                      component={EditScheduledVisit}
                    />
                    <Route 
                      path="/admin/cancel_schedule-visit/"
                      component={CancelScheduleVisit}
                    />
                    <Route
                      path="/admin/edit-visit-detail/"
                      component={EditVisitDetail}
                    />
                    <Route 
                      path={'/admin/cancel-visit/'}
                      component={CancelVisit}
                    />
                    <Route  
                      path="/admin/check-in-visit/"
                      component={CheckInVisit}
                    />
                  
                    <Route
                      path="/admin/Transportation-management"
                      component={Transportation}
                    />
                    <Route
                      path="/admin/Fleet-management"
                      component={FleetManagement}
                    />
                   <Route
                      path="/admin/fuel-expenses"
                      component={FuelExpenses}
                    />
                    <Route
                      path="/admin/vehicle-maintainance"
                      component={VehicleMaintainance}
                    />
                    <Route
                      path="/admin/rostering"
                      component={Roastering}
                    />
                    <Route
                      path="/admin/role-master"
                      component={RoleMaster}
                    />
                    <Route
                      path="/admin/staff-overview"
                      component={StaffOverview}
                    />
                    <Route
                      path="/admin/staff-to-roll"
                      component={StaffToRoll}
                    />
                    <Route
                      path="/admin/staff-to-vehicle"
                      component={StaffToVehicle}
                    />
                    <Route
                      path="/admin/vehicle-master"
                      component={VehicleMaster}
                    />
                    <Route
                      path="/admin/RouteFee-Master"
                      component={RouteFeeMaster}
                    />
                    <Route
                      path="/admin/route-map-stops"
                      component={RouteMapStops}
                    />
                    <Route
                      path="/admin/student-route-bus"
                      component={StudentRouteBus}
                    />
                    <Route
                      path="/admin/student-route"
                      component={StudentRoute}
                    />
                    <Route
                      path="/admin/transportation-route-switch"
                      component={TransportationRouteSwitch}
                    />
                    <Route
                      path="/admin/add-application-assessment"
                      component={AddPreadmission}
                    />
                    <Route
                      path="/admin/view-application-assessments/"
                      component={ViewApplicationAssessments}
                    />
                    <Route
                      path="/admin/preadmission-student-info/"
                      component={PreadmissionStudentInfo}
                    />
                    <Route 
                      path="/admin/academic-reports"
                      component={AcademicReports}
                    />
                    <Route 
                      path="/admin/attendance-report"
                      component={AttendanceReport}
                    />
                    <Route
                      path="/admin/staff-report"
                      component={StaffAttendanceReport}
                    />
                    <Route
                      path="/admin/tc-report"
                      component={TcReport}
                    />
                    <Route
                      path="/admin/student-daily-absent-report"
                      component={StudentDailyAbsentReport}
                    />
                    <Route
                      path="/admin/staff-daily-absent-report"
                      component={StaffDailyAbsentReport}
                    />
                    <Route
                      path="/admin/Institutions"
                      component={Institutions}
                    />
                    <Route
                      path="/admin/Board"
                      component={Board}
                    />
                    <Route
                      path="/admin/Stream"
                      component={Stream}
                      />
                    <Route 
                      path="/admin/upload-staff"
                      component={UploadStaffs}
                    />
                    <Route
                      path="/admin/my-profile"
                      component={ViewStudentInfoProfile}
                    />
                    <Route
                      path="/admin/live-path"
                      component={LiveClass}
                    />
                    <Route
                      path="/admin/edit-preadmission"
                      component={Editpreadmission}
                    />
                    <Route
                      path="/admin/add-institution"
                      component={AddInstitutions}
                    />
                    <Route
                      path="/admin/view-Institution"
                      component={ViewInstitutions}
                    />
                    <Route
                      path="/admin/academic-year"
                      component={AcademicYear}
                    />
                    <Route
                      path="/admin/master-data"
                      component={MasterData}
                    />
                    <Route
                      path="/admin/master/board/add"
                      component={MasterDataBoard}
                    />
                    <Route
                      path="/admin/master/course/add"
                      component={MasterDataCourse}
                    />
                    <Route
                      path="/admin/master/stream/add"
                      component={MasterDataStream}
                    />
                    <Route
                      path="/admin/master/combination/add"
                      component={MasterDataCombination}
                    />

                  </motion.div>
                </Switch>
              </LeftSidebar>
            </Route>
          </Switch>
        </Suspense>
      </AnimatePresence>
    </ThemeProvider>
  );
};

export default Routes;
