import React, { useCallback, useEffect, useState, memo } from "react";
import Paper from "@material-ui/core/Paper";
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
import { owners, appointments } from "../components/data/tasks";

const SchedulerCard = ({ room }) => {
  const currentDate1 = moment();
  const [things, setThings] = useState([]);
  const [loading, setLoading] = useState(false);
  /* getting the data from api
  const schedule = async () => {
    try {
      var path = `/things?room_id=${room}&type=light`;
      await axios.get(path).then((res) => {
        setThings(res.data.result);
      });
      setLoading(true);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    schedule();
  }, []);
*/

  /* sending the data back
  const handleChange = (event) => {
    setThings({
      ...things,
      [event.target.name]: {
        ...things[event.target.name], // gets all the previous values
        sensors: {
          state: event.target.checked,
        },
      },
    });
    let id = event.target.name;
    console.log(event.target.name);
    things[id].sensors.state = event.target.checked;
    axios
      .post(`/control?id=${event.target.name}`, things[id].sensors)
      .then(() => (error) => {
        console.log(error);
      });
  };
*/
  const [data, setData] = useState(appointments);
  const [teacher, setTeacher] = useState(true);

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
      fieldName: "ownerId",
      title: "Owners",
      instances: owners,
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
        const startingAddedId =
          data.length > 0 ? data[data.length - 1].id + 1 : 0;
        setData([...data, { id: startingAddedId, ...added }]);
      }
      if (changed) {
        setData(
          data.map((appointment) =>
            changed[appointment.id]
              ? { ...appointment, ...changed[appointment.id] }
              : appointment
          )
        );
      }
      if (deleted !== undefined) {
        setData(data.filter((appointment) => appointment.id !== deleted));
      }
      setIsAppointmentBeingCreated(false);
    },
    [setData, setIsAppointmentBeingCreated, data]
  );

  const onAddedAppointmentChange = useCallback((appointment) => {
    setAddedAppointment(appointment);
    setIsAppointmentBeingCreated(true);
  });
  console.log(data);
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

  return (
    <React.Fragment>
      <Paper>
        <Scheduler data={data} height={800}>
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
          <Resources data={resources} mainResourceName="ownerId" />
          <AppointmentTooltip showOpenButton showDeleteButton={allowDeleting} />
          <AppointmentForm
            commandButtonComponent={CommandButton}
            readOnly={isAppointmentBeingCreated ? false : !allowUpdating}
          />
          <DragDropProvider allowDrag={allowDrag} allowResize={allowResize} />
        </Scheduler>
      </Paper>
    </React.Fragment>
  );
};

export { SchedulerCard };
