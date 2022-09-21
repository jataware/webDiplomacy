import * as React from "react";
import { useEffect, useState } from "react";
import chess1 from "../../assets/waiting-room-backgrounds/chess1.jpg";
import chess2 from "../../assets/waiting-room-backgrounds/chess2.jpg";
import conference from "../../assets/waiting-room-backgrounds/conference-hall.jpg";
import monument from "../../assets/waiting-room-backgrounds/monument.jpg";
import plane1 from "../../assets/waiting-room-backgrounds/plane1.jpg";
import plane2 from "../../assets/waiting-room-backgrounds/plane2.jpg";
import plane3 from "../../assets/waiting-room-backgrounds/plane3.jpg";
import soldier from "../../assets/waiting-room-backgrounds/soldier.jpg";
import vessel from "../../assets/waiting-room-backgrounds/vessel.jpg";
import vessel2 from "../../assets/waiting-room-backgrounds/vessel2.jpg";
import veteran from "../../assets/waiting-room-backgrounds/wwii-veteran.jpg";

const LogOutButton = (props) => {
    return <button onClick={props.onClick}>Log Out</button>
}

const WelcomeMessage = (props) => {
    var quotes = [<p> “The friend in my adversity I shall always cherish most. I can better trust those who have helped to relieve the gloom of my dark hours than those who are so ready to enjoy with me the sunshine of my prosperity.”
        <br/> - Ulysses S. Grant </ p>,
        <p> “In every battle there comes a time when both sides consider themselves beaten. Then he who continues the attack wins.”
        <br/> - Ulysses S. Grant </ p>,
        <p> “There are but few important events in the affairs of men brought about by their own choice.”
        <br/> - Ulysses S. Grant </ p>,
        <p> “The art of war is simple enough. Find out where your enemy is. Get at him as soon as you can. Strike him as hard as you can, and keep moving on.”
        <br/> - Ulysses S. Grant </ p>,
        <p> "War is an art and as such is not susceptible of explanation by fixed formula"
        <br/> - George Patton </ p>,
        <p> "Accept the challenges so that you can feel the exhilaration of victory."
        <br/> - George Patton </ p>,
        <p> "Lead me, follow me, or get out of my way."
        <br/> - George Patton </ p>,
        <p> "Courage is fear holding on a minute longer."
        <br/> - George Patton </ p>,
        <p> "May God have mercy upon my enemies, because I won’t."
        <br/> - George Patton </ p>,
        <p> "Wars may be fought with weapons, but they are won by men."
        <br/> - George Patton </ p>,
        <p> "I am a soldier, I fight where I am told, and I win where I fight."
        <br/> - George Patton </ p>,
        <p> "Take calculated risks."
        <br/> - George Patton </ p>,
        <p> "You’re never beaten until you admit it."
        <br/> - George Patton </ p>,
        <p> "A good plan executed today is better than a perfect plan executed at some indefinite point in the future."
        <br/> - George Patton </ p>,
        <p> "Go forward until the last round is fired and the last drop of gas is expended…then go forward on foot!"
        <br/> - George Patton </ p>]
    var randomNumber = Math.floor((Math.random() * quotes.length));
    return <div style={{
        fontSize: "35px",
        color: "white",
        position: "absolute",
        textAlign: "center",
        top: "33%",
        left: "0%",
        width: "100%",
        WebkitTextStroke: "1px black"}}> {quotes[randomNumber]} </div>
}


// https://www.imgacademy.com/sites/default/files/2022-07/img-homepage-meta.jpg
const Background = (props) => {
        var images = [chess1, chess2, conference, monument, plane1, plane2, plane3, soldier, vessel, vessel2, veteran]
        var randomNumber = Math.floor((Math.random() * images.length));
        var image = images[randomNumber]
        
        return (
          <div style={{ background: `url(${image})`, 
          backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            width: '100vw',
            height: '100vh'}}>
                <WelcomeMessage />
          </div>
        );
      }

const Lobby = (props) => {
    return (
        <Background>
            <LogOutButton />
            <WelcomeMessage />
        </Background>
        )
    }
    
    export default Lobby