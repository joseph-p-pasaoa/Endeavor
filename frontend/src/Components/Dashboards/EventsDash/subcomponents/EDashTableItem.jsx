import React, { useState, useEffect, useCallback } from 'react';


export default function EDashTableItem(props) {
    const { event, loggedUser, setShowEvent, targetEvent, setTargetEvent, children, className } = props;

    /* 
        props.event.volunteers_list is an array of STRING 
        where reach element is all one volunteer information related to that event separated by ,
        if split(' &$%& ') we will have:
            index0: volunteer ID
            index1: first and last name
            index2: email
            index3: volunteer profile deleted
            index4: event_volunteers table id
            index5: volunteer confirmed to event
    */

    const [ volunteersList, setVolunteersList ] = useState([]);
    const [ loggedVolunteerPartOfEvent, setLoggedVolunteerPartOfEvent ] = useState(false);
    const [ loggedVolunteerRequestAccepted, setLoggedVolunteerRequestAccepted ] = useState(false);
    const [ acceptedVolunteers, setAcceptedVolunteers] = useState([]);


    const mapVolunteersList = () => {
        let found = false;
        let accepted = false;
        const accVolunteers = [];
        const volList = [];

        if (event.volunteers_list && event.volunteers_list[0]) { // IN PSQL when there is no mach for an ARRAY_AGG, instead of having [], we get [null]
            for (let volunteer of event.volunteers_list) {
                const volunteerInfo = volunteer.split(' &$%& ');
                if (loggedUser && loggedUser.v_id && loggedUser.v_id === parseInt(volunteerInfo[0])) { 
                    found = true;
                    if (volunteerInfo[5] === 'true') {
                        accepted = true
                    }
                }
                if (volunteerInfo[5] === 'true') {
                    accVolunteers.push(parseInt(volunteerInfo[0])); // push the id of the volunteer
                }
                volList.push(volunteerInfo);
            }
        }
        volList.sort((a, b) => a[0]-b[0]);

        setLoggedVolunteerPartOfEvent(found);
        setLoggedVolunteerRequestAccepted(accepted);
        setAcceptedVolunteers(accVolunteers);
        setVolunteersList(volList);
    }
    useEffect(mapVolunteersList, [loggedUser, event]);


    const setEventAsTarget = useCallback(() => {
        const eventDataObj = Object.assign({}, event, {
            volunteersList,
            loggedVolunteerPartOfEvent,
            loggedVolunteerRequestAccepted,
            acceptedVolunteers
        });
        setTargetEvent(eventDataObj);
    }, [
        event,
        acceptedVolunteers,
        loggedVolunteerPartOfEvent,
        loggedVolunteerRequestAccepted,
        setTargetEvent,
        volunteersList
    ]);

    useEffect(() => {
        if (targetEvent.event_id && targetEvent.event_id === event.event_id) {
            setEventAsTarget();
        }
    }, [ event, volunteersList, targetEvent.event_id, setEventAsTarget ]);

    
    const handleClickOnEvent = () => {
        setEventAsTarget();
        setShowEvent(true);
    }
    
    // const formatEventDate = date => {
    //     const d = new Date(date).toLocaleDateString();
    //     const t = new Date(date).toLocaleTimeString();
    //     return [d, `${t.slice(0, -6)} ${t.slice(-2)}`];
    // }

    // const eventStart = formatEventDate(event.event_start);
    // const eventEnd = formatEventDate(event.event_end);

    return (
        <span onClick={handleClickOnEvent} className={className} data-toggle="modal" data-target="#primaryModal">
            {children}
        </span>
        // <div className='col-12 col-sm-6 col-lg-4 col-xl-3 p-2'>
        //     <div className='border rounded-lg p-2'>
        //         <header className='text-center font-weight-bolder' onClick={handleClickOnEvent}>{event.topic}</header>
        //         {
        //             eventStart[0] === eventEnd[0]
        //             ?   eventStart[1] === '12:00 AM' && eventEnd[1] === '11:59 PM'
        //                 ?   <p>{eventStart[0]}</p>
        //                 :   <p>{eventStart[0]} {eventStart[1]} to {eventEnd[1]}</p>
        //             :   eventStart[1] === '12:00 AM' && eventEnd[1] === '11:59 PM'
        //                 ?   <p>{eventStart[0]} to {eventEnd[0]}</p>
        //                 :   <p>{eventStart[0]} {eventStart[1]} to {eventEnd[0]} {eventEnd[1]}</p>
        //         }
        //         <p><strong>Host: </strong>{event.instructor}</p>
        //         <p><strong>For: </strong>{event.cohort}</p>
        //         <p><strong>Location: </strong>{event.location}</p>
        //         {
        //             loggedUser && loggedUser.a_id
        //             ?   <p>
        //                     <strong>Volunteers: </strong>{acceptedVolunteers.length + ' / ' + event.number_of_volunteers}
        //                     {
        //                         event.volunteers_list[0] && event.volunteers_list.length - acceptedVolunteers.length
        //                         ? <span className='text-warning'> ({event.volunteers_list.length - acceptedVolunteers.length} pending)</span>
        //                         : null
        //                     }
        //                 </p>
        //             :   null
        //         }
        //         {
        //             loggedUser && loggedUser.v_id && loggedVolunteerPartOfEvent
        //             ?   loggedVolunteerRequestAccepted
        //                 ?   <strong>I'm part of this event</strong>
        //                 :   <strong>Request pending</strong>
        //             :   null
        //         }
        //     </div>
        // </div>
    )
}