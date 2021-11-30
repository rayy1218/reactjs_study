import React from "react"
import ReactDOM from "react-dom"
import {useState, useEffect} from "react";
import "./index.css"

const weekday_string = ["Monday", "Tuesday", "Wednesday", "Thursday", 
                        "Friday", "Saturday", "Sunday"];

function getTimeString(time_h, time_m) {
    time_h = time_h.toString();
    if (time_h.length === 1) {
        time_h = "0" + time_h;
    }

    time_m = time_m.toString();
    if (time_m.length === 1) {
        time_m = "0" + time_m;
    }

    return `${time_h}:${time_m}`
}

function ScheduleTableBlock(props) {
    return (
        <ol className="table-block">
        {props.value.map((event_item, index) => (
            <li key={index} className="table-block-item">{event_item}</li>
        ))}
        </ol>
    );
}

function ScheduleTableRow(props) {
    let time_h = Math.floor(props.index / 2), 
        time_m = (props.index % 2) * 30;
    
    let time = getTimeString(time_h, time_m);

    return (
        <tr>
            <td key="-1">{time}</td>
            {props.value.map((display_x, index) => (
                <td key={index}><ScheduleTableBlock value={display_x} /></td>
            ))}
        </tr>
    );
}

function ScheduleTable(props) {
    return (
        <>
        <table border="1">
            <thead>
            <tr>
                <th key="-1">Time</th>
                {weekday_string.map((day_string, index) => (
                    <th key={index}>{day_string}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {props.display.map((display_y, index_num) => (
                <>
                    <ScheduleTableRow value={display_y} index={index_num}/>
                </>
            ))}
            </tbody>
        </table>
        </>
    );

}

function EventList(props) {
    const handleDeleteButton = (index) => {
        props.deleteEvent(index);
    }

    return (
        <>  
            <h3>Event List</h3>
            <ul className="event-list">
            {props.events_list.map((event_item, index) => (
                <li key={index} className="event-list-item">
                    <span>{event_item.name} on {weekday_string[event_item.weekdays]} at {getTimeString(event_item.start_time_h, event_item.start_time_m)} for {event_item.duration_h} hours</span>
                    <button 
                    onClick={() => handleDeleteButton(index)} 
                    className="del-btn">
                        Delete
                    </button>
                </li>
            ))}
            </ul>
        </>
    );
}

function ScheduleForm(porps) {
    const [input, setInput] = useState({id: "0", name: ""});
    
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInput(values => ({...values, [name]: value}))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (input.name.length === 0) {return;}
        if (input.start_time_h < 0 || input.start_time_h > 23) {return;}
        if (input.start_time_m < 0 || input.start_time_m > 59) {return;}
        if (input.duration_h < 1 || input.duration_h > 23) {return;}
        porps.addEvent(input);
    }

    return (
        <>
            <form className="event-form">
                <fieldset>
                    <legend>Add Event</legend>
                    <label htmlFor="weekday">Weekday: </label>
                    <select 
                        id="weekday" name="id" value={input.id} 
                        onChange={handleChange}
                        required
                    >
                        <option value="0">Monday</option>
                        <option value="1">Tuesday</option>
                        <option value="2">Wednesday</option>
                        <option value="3">Thursday</option>
                        <option value="4">Friday</option>
                        <option value="5">Saturday</option>
                        <option value="6">Sunday</option>
                    </select>
                    <br /><br />
                    <label htmlFor="name">Name: </label>
                    <input 
                        type="text" id="name" name="name" 
                        value={input.name || ""} onChange={handleChange}
                        required
                    />
                    <br /><br />
                    <label htmlFor="start-time">Start at: </label>
                    <input 
                        type="number" id="start-time" name="start_time_h"
                        min="0" max="23" size="2" maxLength="2"
                        value={input.start_time_h || ""}
                        onChange={handleChange}
                    />
                    <span>:</span>
                    <input 
                        type="number" name="start_time_m"
                        min="0" max="59" size="2" maxLength="2" 
                        value={input.start_time_m || ""}
                        onChange={handleChange}
                    />
                    <br /><br />
                    <label htmlFor="duration">Duration: </label>
                    <input
                        type="number" id="duration" name="duration_h"
                        min="1" max="23" size="2" maxLength="2"
                        value={input.duration_h || "0"}
                        onChange={handleChange}
                    />
                    
                    <br /><br />
                    <button type="submit" onClick={handleSubmit}>Create Event</button>
                </fieldset>
            </form>
        </>

    );
}

function ClassSchedule() {
    const [display, setDisplay] = useState(new Array(48).fill(new Array(7).fill([])));
    const [events_list, setEventsList] = useState([]);
   
    

    const updateDisplay = (events_list) => {
        let new_display = new Array(48).fill(new Array(7).fill([]));
        for (let i = 0; i < events_list.length; i += 1) {
            let events = events_list[i];
            for (let j = events.start_time_h * 2; 
                 j < events.start_time_h * 2 + events.duration_h * 2;
                 j += 1) {
                

                let display_row = new_display[j].slice();
                let events_array = display_row[events.weekdays].slice();
                events_array.push(events.name);
                display_row[events.weekdays] = events_array;
                new_display[j] = display_row;
            }
        }
        setDisplay(new_display);

    }

    const addEvent = (input) => {
        let new_events_list = events_list.slice();
        new_events_list.push({
            weekdays: parseInt(input.id),
            name: input.name,
            start_time_h: parseInt(input.start_time_h),
            start_time_m: parseInt(input.start_time_m),
            duration_h: parseFloat(input.duration_h),
        });
        setEventsList(new_events_list);
        
        updateDisplay(new_events_list);
    }
    
    const deleteEvent = (index) => {
        let new_events_list = events_list.slice();

        new_events_list.splice(index, 1);
        setEventsList(new_events_list);

        updateDisplay(new_events_list);
    }

    return (
        <>
            <ScheduleTable display={display} />
            <EventList events_list={events_list} deleteEvent={deleteEvent} />
            <ScheduleForm addEvent={addEvent} />
        </>
    );
}

function App() {
    return (
        <>
            <h1>Class Schedule</h1>
            <ClassSchedule />
        </>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));
