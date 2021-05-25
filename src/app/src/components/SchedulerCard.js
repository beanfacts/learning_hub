import React, { useCallback, useEffect, useState, memo } from "react";
// import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles, withStyles } from "@material-ui/core/styles";
// import DialogTitle from "@material-ui/core/DialogTitle";
// import Dialog from "@material-ui/core/Dialog";
import MuiAlert from "@material-ui/lab/Alert";
// import Paper from "@material-ui/core/Paper";
// import Snackbar from "@material-ui/core/Snackbar";
import axios from "../axios";
import moment from "moment";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
// import IconButton from "@material-ui/core/IconButton";
import {
  Button,
  Typography,
  // Grid,
  CircularProgress,
  InputLabel,
  Paper,
  Snackbar,
  Dialog,
  MenuItem,
  FormHelperText,
  FormControl,
  IconButton,
  Select,
} from "@material-ui/core";

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
  DayView,
  DateNavigator,
  CurrentTimeIndicator,
  ViewSwitcher,
  Resources,
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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 180,
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

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const head = {
  headers: { sessid: sessionStorage.getItem("sessid") },
};

const SchedulerCard = ({ room }) => {
  const currentDate1 = moment();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roomExist, setRoomExist] = useState(false);

  const [lights, setLights] = useState([]);
  const [lightexist, setLightexist] = useState(false);

  const [acdata, setAcdata] = useState({});
  const [acexist, setAcexist] = useState(false);

  const [datafmt, setDatafmt] = useState({});
  const [dataraw, setDataraw] = useState({});

  const [action, setAction] = useState({
    onac: false,
    onlight: false,
  });
  // const [onac, setOnac] = useState(false);
  // const [onlight, setOnlight] = useState(false);

  /* getting the data from api */
  const getSchedule = async () => {
    try {
      const datePast = moment().subtract(7, "d").unix();
      const dateFuture = moment().add(7, "d").unix();
      var path = `/schedule?room_id=${room}&start_time=${datePast}&end_time=${dateFuture}`;
      await axios.get(path, head).then((res) => {
        setSchedule(res.data.result);
      });
      setLoading(true);
    } catch (e) {
      console.log(e);
    }
  };

  const getlights = async () => {
    try {
      var path = `/things?room_id=${room}&type=light`;
      await axios.get(path, head).then((res) => {
        setLights(res.data.result.things);
        console.log(res.data.result.things);
        if (Object.keys(res.data.result.things).length === 0) {
          setLightexist(false);
        } else {
          setLightexist(true);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getaircond = async () => {
    try {
      var path = `/things?room_id=${room}&type=ac`;
      const res = await axios.get(path, head).then((res) => {
        setAcdata(res.data.result.things);
        if (Object.keys(res.data.result.things).length === 0) {
          setAcexist(false);
        } else {
          setAcexist(true);
        }
      });
      setLoading(true);
    } catch (e) {
      console.log(e.result);
    }
  };

  useEffect(() => {
    getSchedule();
    getlights();
    getaircond();
  }, [room]);

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

  const handleChange = (event) => {
    setTime(event.target.value);
  };

  const handlecheckbox = (event) => {
    setAction({ ...action, [event.target.name]: event.target.checked });
  };
  useEffect(() => {
    setData(result);
  }, [schedule]);

  const [teacher, setTeacher] = useState(true);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(true);
  const [currentDate, setCurrentDate] = useState(currentDate1);
  const [time, setTime] = useState("");
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

  const scheduleaction = () => {};

  const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h5">{children}</Typography>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });

  const DialogContent = withStyles((theme) => ({
    root: {
      padding: theme.spacing(10),
      // backgroundColor: 'skyblue',
    },
  }))(MuiDialogContent);

  const DialogActions = withStyles((theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(1),
    },
  }))(MuiDialogActions);

  const onCommitChanges = useCallback(
    ({ added, changed, deleted }) => {
      if (added) {
        const r = Math.random().toString(36).substring(7);
        const startingAddedId = r;
        const temp = { id: startingAddedId, ...added };
        console.log(temp);

        const reply = {
          course_id: temp.course_id,
          reservation_id: temp.id,
          start_time: new Date(temp.startDate).getTime() / 1000,
          end_time: new Date(temp.endDate).getTime() / 1000,
          description: temp.notes,
          room_id: room,
          title: temp.title,
          actions: [],
        };

        // setDatafmt(reply);
        // setDataraw([
        //   ...data,
        //   { id: response.data.result.reservation_id, ...added },
        // ])
        axios
          .post(`/schedule`, reply, head)
          .then((response) => {
            console.log(response.data.result.reservation_id);
            setData([
              ...data,
              { id: response.data.result.reservation_id, ...added },
            ]);
            scheduleaction();
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
                console.log(reply);
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
    },
    [setData, setIsAppointmentBeingCreated, data]
  );

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleClose1 = (event, reason) => {
    setOpen1(false);
  };

  const onAddedAppointmentChange = useCallback((appointment) => {
    setAddedAppointment(appointment);
    setIsAppointmentBeingCreated(true);
  });

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
              <ViewState
                defaultCurrentDate={currentDate}
                defaultCurrentViewName="Week"
              />
              <EditingState
                onCommitChanges={onCommitChanges}
                addedAppointment={addedAppointment}
                onAddedAppointmentChange={onAddedAppointmentChange}
              />
              <IntegratedEditing />
              <DayView startDayHour={9} endDayHour={18} />
              <WeekView
                startDayHour={9}
                endDayHour={19}
                timeTableCellComponent={TimeTableCell}
              />
              <Toolbar />
              <DateNavigator />
              <TodayButton />
              <Appointments />
              <Resources data={resources} mainResourceName="course_id" />
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
              <ViewSwitcher />
              <CurrentTimeIndicator />
            </Scheduler>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error">
                Access Denied
              </Alert>
            </Snackbar>
          </Paper>
          <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            open={open1}
            onClose={handleClose}
          >
            <DialogTitle>Schedule Actions</DialogTitle>
            <DialogContent dividers>
              <FormControl className={classes.formControl}>
                <InputLabel id="select time">Before Class</InputLabel>
                <Select
                  labelId="select time"
                  id="demo-simple-select"
                  value={time}
                  onChange={handleChange}
                >
                  <MenuItem value={5}>5 minutes</MenuItem>
                  <MenuItem value={10}>10 minutes</MenuItem>
                  <MenuItem value={15}>15 minutes</MenuItem>
                </Select>
              </FormControl>
              {!acexist && (
                <>
                  <br />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={action.onac}
                        onChange={handlecheckbox}
                        name="onac"
                        color="primary"
                      />
                    }
                    label="Turn on AC"
                  />
                </>
              )}
              {!lightexist && (
                <>
                  <br />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={action.onlight}
                        onChange={handlecheckbox}
                        name="onlight"
                        color="primary"
                      />
                    }
                    label="Turn on Lights"
                  />
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose1} color="primary">
                Cancel
              </Button>
              <Button onClick={handleClose1} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
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
