import React, { useCallback, useEffect, useState, memo } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import MuiAlert from "@material-ui/lab/Alert";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import axios from "../axios";
import moment from "moment";

import {
  ViewState,
  EditingState,
  IntegratedEditing,
} from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  DragDropProvider,
  TodayButton,
  Toolbar,
  Resources,
  DateNavigator,
} from "@devexpress/dx-react-scheduler-material-ui";
import { courses, appointments } from "../components/data/tasks";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  first: {
    padding: theme.spacing(4),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "90%",
  },
  BulbIcon: {
    fontSize: "7rem",
    color: "#b2b2b2",
  },
  BulbIconLit: {
    fontSize: "7rem",
    color: "#ffde3b",
  },
}));

const head = {
  headers: { sessid: sessionStorage.getItem("sessid") },
};

const SchedulerCard = ({ room }) => {
  room = "hm_601";
  const currentDate1 = moment();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);

  /* getting the data from api */
  const getSchedule = async () => {
    try {
      const datePast = moment().subtract(7, "d").unix();
      const dateFuture = moment().add(7, "d").unix();
      // console.log(dateFuture, datePast);
      var path = `/schedule?room_id=${room}&start_time=${datePast}&end_time=${dateFuture}`;
      await axios.get(path, head).then((res) => {
        setSchedule(res.data.result);
        console.log(res.data.result);
      });
      setLoading(true);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getSchedule();
  }, []);

  const result = schedule.map((apmnt) => ({
    course_id: apmnt.course_id,
    id: apmnt.reservation_id,
    user: apmnt.username,
    startDate: new Date(apmnt.start_time * 1000),
    endDate: new Date(apmnt.end_time * 1000),
    notes: apmnt.description,
    room_id: apmnt.room_id,
    title: apmnt.title,
  }));

  const [data, setData] = useState([]);

  useEffect(() => {
    setData(result);
  }, [loading]);
  const [teacher, setTeacher] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [currentDate, setCurrentDate] = useState(currentDate1);
  const [editingOptions, setEditingOptions] = useState({
    allowAdding: teacher,
    allowDeleting: teacher,
    allowUpdating: teacher,
    allowDragging: teacher,
    allowResizing: teacher,
  });
  const [addedAppointment, setAddedAppointment] = useState({});
  const [isAppointmentBeingCreated, setIsAppointmentBeingCreated] =
    useState(false);

  const resources = [
    {
      fieldName: "course_id",
      title: "Course",
      instances: courses,
    },
  ];

  const {
    allowAdding,
    allowDeleting,
    allowUpdating,
    allowResizing,
    allowDragging,
  } = editingOptions;

  const onCommitChanges = useCallback(
    ({ added, changed, deleted }) => {
      if (added) {
        const r = Math.random().toString(36).substring(7);
        const startingAddedId = data.length > 0 ? r : 0;
        const temp = { id: startingAddedId, ...added };

        const reply = {
          course_id: temp.course_id,
          reservation_id: temp.id,
          start_time: new Date(temp.startDate).getTime() / 1000,
          end_time: new Date(temp.endDate).getTime() / 1000,
          description: temp.notes,
          room_id: room,
          title: temp.title,
        };
        axios
          .post(`/schedule`, reply, head)
          .then((response) => {
            setData([...data, { id: startingAddedId, ...added }]);
          })
          .catch((err) => {
            console.log(err);
            setOpen(true);
          });
      }
      if (changed) {
        data.map((appointment) => {
          if (changed[appointment.id]) {
            const temp = { ...appointment, ...changed[appointment.id] };
            console.log(temp);
            const reply = {
              course_id: temp.course_id,
              reservation_id: temp.id,
              start_time: new Date(temp.startDate).getTime() / 1000,
              end_time: new Date(temp.endDate).getTime() / 1000,
              description: temp.notes,
              room_id: room,
              title: temp.title,
            };
            axios
              .patch(`/schedule`, reply, head)
              .then((response) => {
                setData(
                  data.map((appointment) =>
                    changed[appointment.id]
                      ? { ...appointment, ...changed[appointment.id] }
                      : appointment
                  )
                );
              })
              .catch((err) => {
                setOpen(true);
              });
          }
        });
      }
      if (deleted !== undefined) {
        const temp = data.filter((appointment) => appointment.id === deleted);
        const reply = {
          reservation_id: temp[0].id,
          room_id: room,
        };
        axios
          .delete(
            `/schedule?room_id=${reply.room_id}&reservation_id=${reply.reservation_id}`,
            head
          )
          .then(() => {
            setData(data.filter((appointment) => appointment.id !== deleted));
          })
          .catch((err) => {
            setOpen(true);
          });
        console.log(reply);
      }
      setIsAppointmentBeingCreated(false);

      // console.log(reply);
    },
    [setData, setIsAppointmentBeingCreated, data]
  );

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const onAddedAppointmentChange = useCallback((appointment) => {
    setAddedAppointment(appointment);
    setIsAppointmentBeingCreated(true);
  });
  // console.log(data);

  const TimeTableCell = useCallback(
    memo(({ onDoubleClick, ...restProps }) => (
      <WeekView.TimeTableCell
        {...restProps}
        onDoubleClick={allowAdding ? onDoubleClick : undefined}
      />
    )),
    [allowAdding]
  );

  const CommandButton = useCallback(
    ({ id, ...restProps }) => {
      if (id === "deleteButton") {
        return (
          <AppointmentForm.CommandButton
            id={id}
            {...restProps}
            disabled={!allowDeleting}
          />
        );
      }
      return <AppointmentForm.CommandButton id={id} {...restProps} />;
    },
    [allowDeleting]
  );

  const allowDrag = useCallback(
    () => allowDragging && allowUpdating,
    [allowDragging, allowUpdating]
  );

  const allowResize = useCallback(
    () => allowResizing && allowUpdating,
    [allowResizing, allowUpdating]
  );
  const classes = useStyles();
  return (
    <>
      {loading ? (
        <React.Fragment>
          <Paper>
            <Scheduler data={data} height={"auto"}>
              <ViewState defaultCurrentDate={currentDate} />
              <EditingState
                onCommitChanges={onCommitChanges}
                addedAppointment={addedAppointment}
                onAddedAppointmentChange={onAddedAppointmentChange}
              />
              <IntegratedEditing />
              <WeekView
                startDayHour={9}
                endDayHour={19}
                timeTableCellComponent={TimeTableCell}
              />
              <Toolbar />
              <DateNavigator />
              <TodayButton />
              <Appointments />
              {/* <Resources data={resources} mainResourceName="course_id" /> */}
              <AppointmentTooltip
                showOpenButton
                showDeleteButton={allowDeleting}
              />
              <AppointmentForm
                commandButtonComponent={CommandButton}
                readOnly={isAppointmentBeingCreated ? false : !allowUpdating}
              />
              <DragDropProvider
                allowDrag={allowDrag}
                allowResize={allowResize}
              />
            </Scheduler>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error">
                Access Denied
              </Alert>
            </Snackbar>
          </Paper>
        </React.Fragment>
      ) : (
        <div className={classes.first}>
          <CircularProgress />
        </div>
      )}
    </>
  );
};

export { SchedulerCard };
