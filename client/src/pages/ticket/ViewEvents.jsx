import {viewTickets} from '../../services/ticketService';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
const ViewEvents = () => {
    const [events, setEvents] = useState([]);
    const user = useSelector((state) => state.user);

    useEffect(() => {
        const fetchEvents = async () => {
            const data = await viewTickets();
            setEvents(data);
        };
        fetchEvents();
    }, []);

    return (
        <div>
            <h1>View Events</h1>
            <ul>
                {events.map((event) => (
                    <li key={event.id}>
                        <Link to={`/events/${event.id}`}>{event.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default ViewEvents;
