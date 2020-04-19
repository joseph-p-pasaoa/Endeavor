/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Time Route Handler | Capstone App (Pursuit Volunteer Mgr)
*/

const express = require('express');
const router = express.Router();

const handleError = require('../helpers/handleError');
const processInput = require('../helpers/processInput');
const eventAttendeesQueries = require('../queries/eventAttendees');


// Get all volunteers attending an event by its Id
router.get('/volunteers/:event_id', async (request, response, next) => {
    try {
        const eventId = processInput(request.params.event_id, 'idNum', 'event id');
        const volunteers = await eventAttendeesQueries.getEventVolunteersByEventId(eventId);

        response.json({
            err: false,
            message: `Successfully retrieved all the volunteers attending event.${eventId}`,
            payload: volunteers,
        });
    } catch (err) {
        handleError(err, request, response, next);
    }
});

// Confirm or un-confirm a volunteer request to be at en event
router.patch('/event/:event_id/volunteer/:volunteer_id', async (request, response, next) => {
    try {
        if (request.user && request.user.admin) {
            const updateData = {
                eventId: processInput(request.params.event_id, 'idNum', 'event id'),
                volunteerId: processInput(request.params.volunteer_id, 'idNum', 'volunteer id'),
                confirmed: processInput(request.body.confirmed, 'bool', 'volunteer confirmed')
            }
            const volunteer = await eventAttendeesQueries.manageVolunteerRequest(updateData);
    
            response.json({
                err: false,
                message: `Successfully updated volunteer.${updateData.volunteerId} attending event.${updateData.eventId}`,
                payload: volunteer,
            });
        } else {
            throw new Error('403__Not allowed to perform this operation');
        }
    } catch (err) {
        handleError(err, request, response, next);
    }
});

// Volunteer request to attend an event
router.post('/event/:event_id/add/:volunteer_id', async (request, response, next) => {
    try {
        const volunteerId = processInput(request.params.volunteer_id, 'idNum', 'volunteer id');
        if (request.user && request.user.v_id && request.user.v_id === volunteerId) {
            const postData = {
                eventId: processInput(request.params.event_id, 'idNum', 'event id'),
                volunteerId
            }
            const volunteerRequest = await eventAttendeesQueries.signupVolunteerForEvent(postData);
    
            response.json({
                err: false,
                message: `Successfully added volunteer.${volunteerId} request to attend event.${postData.eventId}`,
                payload: volunteerRequest,
            });

        } else {
            throw new Error('403__Not allowed to perform this operation');
        }
    } catch (err) {
        handleError(err, request, response, next);
    }
});

// Volunteer request to attend an event
router.delete('/event/:event_id/delete/:volunteer_id', async (request, response, next) => {
    try {
        const volunteerId = processInput(request.params.volunteer_id, 'idNum', 'volunteer id');
        if (request.user && request.user.v_id && request.user.v_id === volunteerId) {
            const deleteData = {
                eventId: processInput(request.params.event_id, 'idNum', 'event id'),
                volunteerId
            }
            const volunteerRequest = await eventAttendeesQueries.deleteVolunteerFromEvent(deleteData);
    
            response.json({
                err: false,
                message: `Successfully deleted volunteer.${volunteerId} request to attend event.${deleteData.eventId}`,
                payload: volunteerRequest,
            });

        } else {
            throw new Error('403__Not allowed to perform this operation');
        }
    } catch (err) {
        handleError(err, request, response, next);
    }
});


module.exports = router;