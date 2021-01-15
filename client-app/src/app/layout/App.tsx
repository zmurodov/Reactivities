import React, {SyntheticEvent, useEffect, useState} from 'react';
import {Container} from 'semantic-ui-react';
import {IActivity} from '../models/activity';
import {Navbar} from '../../features/nav/Navbar'
import {ActivityDashboard} from '../../features/activities/dashboard/ActivityDashboard'
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";


const App = () => {

    const [activities, setActivities] = useState<IActivity[]>([])
    const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
    const [editMode, setEditMode] = useState(false)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [target, setTarget] = useState('')

    const handleSelectActivity = (id: string) => {
        setSelectedActivity(activities.filter(a => a.id === id)[0])
        setEditMode(false)
    }

    const handleOpenCreateForm = () => {
        setSelectedActivity(null);
        setEditMode(true);
    }

    const handleCreateActivity = (activity: IActivity) => {
        setSubmitting(true)
        agent.Activities.create(activity).then(() => {
            setActivities([...activities, activity])
            setSelectedActivity(activity)
            setEditMode(false)

        }).then(() => setSubmitting(false))
    }

    const handleEditActivity = (activity: IActivity) => {
        setSubmitting(true)
        agent.Activities.update(activity).then(() => {
            setActivities([...activities.filter(a => a.id !== activity.id), activity])
            setSelectedActivity(activity)
            setEditMode(false)
        }).then(() => setSubmitting(false))
    }

    const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        setSubmitting(true)
        setTarget(event.currentTarget.name)
        agent.Activities.delete(id).then(() => {
            setActivities([...activities.filter(a => a.id !== id)])
        }).then(() => setSubmitting(false))
    }

    useEffect(() => {
        agent.Activities.list()
            .then(response => {
                let activities: IActivity[] = []
                response.forEach(activity => {
                    activity.date = activity.date.split('.')[0]
                    activities.push(activity)
                })
                setActivities(activities)
            }).then(() => setLoading(false))
    }, [])

    if (loading) return <LoadingComponent content='Loading activities...'/>

    return (
        <React.Fragment>
            <Navbar openCreateForm={handleOpenCreateForm}/>
            <Container style={{marginTop: '7em'}}>
                <ActivityDashboard activities={activities}
                                   selectActivity={handleSelectActivity}
                                   selectedActivity={selectedActivity!}
                                   setSelectedActivity={setSelectedActivity}
                                   editMode={editMode}
                                   setEditMode={setEditMode}
                                   deleteActivity={handleDeleteActivity}
                                   createActivity={handleCreateActivity}
                                   editActivity={handleEditActivity}
                                   submitting={submitting}
                target={target}/>
            </Container>
        </React.Fragment>
    );
}

export default App;
