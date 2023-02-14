import React, { useDebugValue, useEffect, useState } from "react";
import Activitycard from "../Components/Activitycard";
import Modalpopup from "../Components/Modalpopup";
import Adddog from "../Components/Adddog";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import TabComponent from "../Components/TabComponent";
import Dogname from "../Components/Dogname";
import "../stylesheets/style.css";
import 'bulma/css/bulma.css'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import { fontStyle } from "@mui/system";
import AddCareTaker from "../Components/AddCareTaker";
// import LabTabs from "../Components/miniTabs";


function Dashboard({ isAuthenticated, setIsAuthenticated, user, setUser}) {

    const [dog, setDog] = useState([]);
    const [activities, setActivities] = useState([]);
    const [infoClicked, setInfoClicked] = useState(false);
    const [dogInfoClicked, setDogInfoClicked] = useState(false);
    const [dogsExist, setDogsExist] = useState(false);
    const [activeTab, setActiveTab] = useState('');
    const [rerender, setRerender] = useState(false);
    useEffect(() => {
        if (isAuthenticated) {
            (async () => {
                const dogs = await getDogsByUser(user.id)
                // setDog(dogs)
                setDogsExist(true)

                // console.log(dogs)
            })();

            // console.log("we've arrived")
            // console.log("activities", activities);
        }
    }, [])

    // let dogList = dog.map

    useEffect(() => { }, [rerender])

    useEffect(() => {
        if (dogsExist == true) {
            // console.log("second condition");
            setActiveTab(dog[0].dogid)

            handleGetActivities()
        }
    }, [dogsExist, dog])

    

    // async function getNewActivity(){
    //     let res = await 
    // }

    async function handleSetDogs(value) {
        // setDog(value)
        await getDogsByUser(user.id)
        // console.log("tester", dog)
        // console.log('arrived at handleSetDogs')
    }


    function handleGetActivities() {
        setActivities([])
        console.log('inside handlegetactivities function')
        dog.forEach(doggy => {
            // console.log("tesinggggg", doggy.dogname);

            getActivitesByDog(doggy.dogid);
            // setActivities(activityList)
        })
    }

    function handleSetActivities(value) {
        setActivities(value)
    }

    function onInfoClick() {
        setInfoClicked(!infoClicked);
    }

    function onDogInfoClick() {
        setDogInfoClicked(!dogInfoClicked);
    }

    async function getDogsByUser(userid) {
        let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/Dog/${userid}`)
        res = await res.json()
        console.log("this is the res", res)
        setDog(res)

            ;

    }

    async function getActivitesByDog(dogid) {
        // console.log('saving information for', dogid)
        let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/Activity/${dogid}`)
        res = await res.json()
        setActivities(activities => [...activities, res]);
    }

    function handleTabChange(value) {
        setActiveTab(value)
    }

    function handleRerender(value) {
        setRerender(value)
    }

    



    let moreInfo = <a onClick={onInfoClick} className="Addactivity" ><AddCircleRoundedIcon sx={{fontSize: 40 }}/></a>
    if (infoClicked) {
        moreInfo = (
            <div>
                <Modalpopup handleGetActivities={handleGetActivities} handleSetActivities={handleSetActivities} handleRerender={handleRerender} rerender={rerender} handleClose={onInfoClick} open={infoClicked} dog={dog} user={user.id} />
                <button onClick={onInfoClick}>Cancel</button>
            </div>
        )
    }


    let addDog = <button className="button is-primary" onClick={onDogInfoClick}>Add Dog</button>
    if (dogInfoClicked) {
        addDog = (
            <div>
                <Adddog handleClose={onDogInfoClick} open={dogInfoClicked} user={user.id} handleSetDogs={handleSetDogs} getDogByUser={getDogsByUser} dog={dog} />
                <button onClick={onDogInfoClick}>Cancel</button>
            </div>
        )
    }

    let activitiescards
    activities.forEach(dog => {
        if (dog.length > 0) {
            if (dog[0].Dog.id == activeTab) {
                activitiescards = dog.map((activity, index) => {
                    // console.log('loop', index)
                    return (
                        <div>
                            <Activitycard key={activity.id} activity={activity} handleTabChange={handleTabChange} activeTab={activeTab} tabId={activity.dogid} handleGetActivities={handleGetActivities} handleSetActivities={handleSetActivities}

                            />

                        </div>

                    )
                })
            }
        }
    })

let names 
if (dog.length > 0) {
    names = dog.map((doggy, index)=>{
        return(
            <div>
                <Dogname doggy={doggy["Dog"]} dogid={doggy.dogid} activeTab={activeTab}/>
            </div>
        )
    })
}



    let tabs
    console.log("activities", activities)
    tabs = activities.map((activity, index) => {

        if (activity.length > 0) {
            return (
                <TabComponent key={activity.id} tabId={activity[0].Dog.id} activity={activity} dogName={activity[0].Dog.dogname} dogId={activity[0]['Dog'].dogid} activeTab={activeTab} DogPhoto={activity[0].Dog.Profilephoto}handleTabChange={handleTabChange}
                />)
        }

    })

    // if (loggedIn) {
    //     (async () => {
    //         const dogs = await getDogsByUser(user.id);
    //         const activities = await getActivitesByDog(dog.id);
    //         setDog(dogs)
    //     })();

    // }

    return (
        <div className="spaceBehind">
            <h1 className="title" style={{color:"#cb997e", fontFamily:"fredoka", paddingTop:"15px", paddingLeft:"15px"}}>Welcome, {user.firstname}!</h1>
      
            <div className="tabs is-boxed" style={{marginBottom:"0px"}}>
                <ul >
                    {tabs}
                    <li className={activeTab == 1 ? "is-active" : ""}>
                        <span>{addDog}</span>
                    </li>
                </ul>
            </div>
          
            <div className="ActivityFeed">
            {/* <LabTabs/> */}
            <div>
            
          <div className="tabHeading"> <h1 className="title">{names}</h1> 
          <AddCareTaker activeTab={activeTab}/>{moreInfo} </div>
           
           
            {activitiescards}
            </div>
            </div>
        </div>


    )

}
export default Dashboard;