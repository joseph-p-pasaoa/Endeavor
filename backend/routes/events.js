/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Events Route  | Capstone App (Pursuit Volunteer Mgr)
*/
const express = require('express');
const router = express.Router();

const handleError = require('../helpers/handleError');
const processInput = require('../helpers/processInput');

const eventsQueries = require('../queries/events');

// Get all events (past events are auto pushed to the back)
router.get('/all/', async (req, res, next) => {
    try {
        const vName = processInput(req.query.v_name, "softVC", "volunteer name", 60).toLowerCase();
        const topic = processInput(req.query.topic, "softVC", "event topic", 50).toLowerCase();
        const instructor = processInput(req.query.instructor, "softVC", "event instructor", 100).toLowerCase();
        const upcoming = processInput(req.query.upcoming, "softVC", "upcoming events", 60);
        const past = processInput(req.query.past, "softVC", "past events", 60);

        let allEvents = await eventsQueries.getAllEvents(vName, topic, instructor, upcoming, past);
        res.status(200)
        .json({
            payload: allEvents,
            message: "Success",
            err: false
        });
    } catch (err) {
        handleError(err, req, res, next);
    }
});

//Get single event
router.get('/event/:e_id', async (req, res, next) => {
    try {
        const eId = processInput(req.params.e_id, "idNum", "event id");

        let event = await eventsQueries.getSingleEvent(eId);
        res.status(200)
            .json({
                payload: event,
                message: "Success",
                err: false
            });
    } catch (err) {
        handleError(err, req, res, next);
    }
})


//Get all events  (admin)
router.get('/admin/all', async (req, res, next) => {
    try{
        const vName = processInput(req.query.v_name, "softVC", "volunteer name", 60).toLowerCase();
    const topic = processInput(req.query.topic, "softVC", "event topic", 50).toLowerCase();
    const instructor = processInput(req.query.instructor, "softVC", "event instructor", 100).toLowerCase();
    const upcoming = processInput(req.query.upcoming, "softVC", "upcoming events", 60);
    const past = processInput(req.query.past, "softVC", "past events", 60);

    let allEventsAdmin = await eventsQueries.getAllEventsAdmin(vName, topic, instructor, upcoming, past);
    res.status(200)
    .json({
        payload: allEventsAdmin,
        message: "Success",
        err: false
    });
} catch (err) {
    handleError(err, req, res, next);
}
    
});

//Get single event (admin only)
router.get('/admin/event/:e_id', async (req, res, next) => {
    try {
        const eId = processInput(req.params.e_id, "idNum", "event id");

        let event = await eventsQueries.getSingleEventAdmin(eId);
        res.status(200)
            .json({
                payload: event,
                message: "Success",
                err: false
            });
    } catch (err) {
        handleError(err, req, res, next);
    }
})

// Get all upcoming events
router.get('/upcoming', async (req, res, next) => {
    try {
        let allEvents = await eventsQueries.getUpcomingEvents();
        res.json({
            payload: allEvents,
            message: "Success",
            err: false
        });
    } catch (err) {
        handleError(err, req, res, next);
    }
});

// Get all past events
router.get('/past', async (req, res, next) => {
    try {
        let allEvents = await eventsQueries.getPastEvents();
        res.json({
            payload: allEvents,
            message: "Success",
            err: false
        });
    } catch (err) {
        handleError(err, req, res, next);
    }
});

// Get all past events by volunteer id
router.get('/past/volunteer/:volunteer_id', async (req, res, next) => {
    try {
        const volunteerId = processInput(req.params.volunteer_id, 'idNum', 'volunteer id');
        const events = await eventsQueries.getPastEventsByVolunteerId(volunteerId);
        res.json({
            payload: events,
            message: "Success",
            err: false
        });
      } catch (err) {
        handleError(err, req, res, next);
    }
});

// Get all past events by fellow id
router.get('/past/fellow/:fellow_id', async (req, res, next) => {
    try {
        const fellowId = processInput(req.params.fellow_id, 'idNum', 'volunteer id');
        const events = await eventsQueries.getPastEventsByFellowId(fellowId);
        res.json({
            payload: events,
            message: "Success",
            err: false
        });
      } catch (err) {
        handleError(err, req, res, next);
    }
});


// Delete an event by its ID
router.delete('/:event_id', async (req, res, next) => {
    try {
        const eventId = processInput(req.params.event_id, 'idNum');
        if (req.user && req.user.a_id) {
            const deletedEvent = await eventsQueries.deleteEvent(eventId);
            res.json({
                payload: deletedEvent,
                message: `Successfully deleted event.${eventId}`,
                err: false
            });
        } else {
            throw new Error('403__Not allowed to perform this operation')
        }
    } catch (err) {
        handleError(err, req, res, next);
    }
});

module.exports = router;
