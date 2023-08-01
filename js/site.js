const events = [
    {
        event: "ComicCon",
        city: "New York",
        state: "New York",
        attendance: 240000,
        date: "06/01/2017",
    },
    {
        event: "ComicCon",
        city: "New York",
        state: "New York",
        attendance: 250000,
        date: "06/01/2018",
    },
    {
        event: "ComicCon",
        city: "New York",
        state: "New York",
        attendance: 257000,
        date: "06/01/2019",
    },
    {
        event: "ComicCon",
        city: "San Diego",
        state: "California",
        attendance: 130000,
        date: "06/01/2017",
    },
    {
        event: "ComicCon",
        city: "San Diego",
        state: "California",
        attendance: 140000,
        date: "06/01/2018",
    },
    {
        event: "ComicCon",
        city: "San Diego",
        state: "California",
        attendance: 150000,
        date: "06/01/2019",
    },
    {
        event: "HeroesCon",
        city: "Charlotte",
        state: "North Carolina",
        attendance: 40000,
        date: "06/01/2017",
    },
    {
        event: "HeroesCon",
        city: "Charlotte",
        state: "North Carolina",
        attendance: 45000,
        date: "06/01/2018",
    },
    {
        event: "HeroesCon",
        city: "Charlotte",
        state: "North Carolina",
        attendance: 50000,
        date: "06/01/2019",
    },
];

function buildDropdown() {
    let currentEvents = getEvents();
    let eventCities = currentEvents.map(event => event.city)
    let dropdownChoices = ['All', ...new Set(eventCities)];

    const dropdownDiv = document.getElementById('city-dropdown');
    const dropdownItemTemplate = document.getElementById('dropdown-template');

    dropdownDiv.innerHTML = '';
    dropdownChoices.forEach(choice => {
        let dropdownCopy = dropdownItemTemplate.content.cloneNode(true);
        dropdownCopy.querySelector('a').innerText = choice;
        dropdownDiv.appendChild(dropdownCopy);
    });

    document.getElementById('stats-location').innerText = 'All';
    displayStats(currentEvents);
    displayEvents(currentEvents);
}

function getEvents() {
    let storedEvents = JSON.parse(localStorage.getItem('stub-events') || '[]');
    if (storedEvents.length == 0) {
        storedEvents = events;
        localStorage.setItem('stub-events', JSON.stringify(events));
    }
    return storedEvents;
}

function displayEvents(events) {
    const eventsTable = document.getElementById('events-table');
    const tableRowTemplate = document.getElementById('table-row-template');
    eventsTable.innerHTML = '';

    events.forEach(event => {
        let tableRowCopy = tableRowTemplate.content.cloneNode(true);
        Object.keys(event).forEach(property => {
            let value = event[property].toLocaleString();
            property == 'date' ? value = new Date(event[property]).toLocaleDateString() : '';
            tableRowCopy.querySelector(`[data-id="${property}"]`).innerText = value;
        });
        eventsTable.appendChild(tableRowCopy)
    });
}

function displayStats(events) {
    let total = 0;
    let min = events[0].attendance;
    let max = min;
    for (i = 0; i < events.length; i++) {
        total += events[i].attendance;
        events[i].attendance > max ? max = events[i].attendance : '';
        events[i].attendance < min ? min = events[i].attendance : '';
    }
    document.getElementById('total-attendance').innerHTML = total.toLocaleString();
    document.getElementById('average-attendance').innerHTML = Math.round(total / events.length).toLocaleString();
    document.getElementById('most-attended').innerHTML = max.toLocaleString();
    document.getElementById('least-attended').innerHTML = min.toLocaleString();
}

function filterEvents(dropdownItemClicked) {
    let cityName = dropdownItemClicked.innerText;
    let allEvents = getEvents();
    let filteredEvents = [];
    document.getElementById('stats-location').innerText = cityName;
    filteredEvents = allEvents.filter(event => cityName == 'All' || event.city == cityName);
    displayStats(filteredEvents);
    displayEvents(filteredEvents);
}

function saveEvent() {
    let event = document.getElementById('newEventName').value;
    let city = document.getElementById('newEventCity').value;
    let attendance = parseInt(document.getElementById('newEventAttendance').value);

    let stateSelect = document.getElementById('newEventState');
    let selectedIndex = stateSelect.selectedIndex;
    let selectedOption = stateSelect.options[selectedIndex];
    let state = selectedOption.text;

    let dateString = `${document.getElementById('newEventDate').value} 00:00`;
    let date = new Date(dateString).toLocaleDateString();

    let newEvent = {event, city, state, attendance, date};
    let allEvents = getEvents();
    allEvents.push(newEvent);
    localStorage.setItem('stub-events', JSON.stringify(allEvents));

    document.getElementById('newEventForm').reset();
    buildDropdown();
    closeModal();
}

function closeModal() {
    let modal = bootstrap.Modal.getInstance(document.getElementById('addEventModal'))
    modal.hide();
}