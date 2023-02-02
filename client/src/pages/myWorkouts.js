import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

// remove getMe? import { getMe, deleteWorkout } from '../utils/API';
import Auth from '../utils/auth';
import { removeWorkoutId } from '../utils/localStorage';

const SavedWorkout = () => {
  const [userData, setUserData] = useState({});

  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
          return false;
        }

        const response = await getMe(token);

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        const user = await response.json();
        setUserData(user);
      } catch (err) {
        console.error(err);
      }
    };

    getUserData();
  }, [userDataLength]);

  // from the challenge starter code: "create function that accepts the book's mongo _id value as param and deletes the book from the database"
  const handleDeleteWorkout = async (workoutId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await deleteWorkout(workoutId, token);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const updatedUser = await response.json();
      setUserData(updatedUser);
      // upon success, remove book's id from localStorage
      removeWorkoutId(workoutId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing your workouts!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedWorkouts.length
            ? `Viewing ${userData.savedWorkouts.length} saved ${userData.savedWorkouts.length === 1 ? 'workouts' : 'workouts'}:`
            : 'You have no saved workouts :('}
        </h2>
        <CardColumns>
          {userData.savedWorkouts.map((workouts) => {
            return (
              <Card key={workouts.workoutId} border='dark'>
                {/* check on this image reference & replace language about "The cover...."*/}
                {workout.gifUrl ? <Card.Img src={workout.gifUrl} alt={`The cover for ${workout.name}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{workout.name}</Card.Title>
                  <p className='small'>Target: {workout.target}</p>
                  <Card.Text>{workout.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteWorkout(workout.workoutId)}>
                    Remove this Workout
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedWorkout;