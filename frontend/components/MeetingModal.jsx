import React, { useState, useEffect } from 'react';
import {post} from 'utils/api';

export default function Modal(props){
  return (
    <div className="modal" role="dialog">
        {props.userRegistration.is_host && <HostView {... props} />}
        {!props.userRegistration.is_host && <ParticipantView {... props} />}
      </div>
  );
}

function ParticipantView(props){
  return (
    <div className="modal-dialog modal-dialog-centered modal-dialog-guest" role="document">
      <div className="modal-content modal-content-guest align-middle">
      {/* TODO: reference a variable that can actually tell if manual or zoom call */}
      <div className="modal-body">
        <h4 className="modal-title text-center">
          {props.userRegistration.join_url && 
            <p><a href={props.userRegistration.join_url} target="_blank" 
              className="btn btn-primary btn-lg">Click here to join your breakout</a></p>}
          {props.meeting.manual_transfer && 'The host has frozen breakouts.'}
          {props.meeting.zoom_transfer && !props.userRegistration.join_url &&
            'Generating a Zoom link for you...'}
        </h4>
        {!props.userRegistration.join_url && props.meeting.zoom_transfer &&
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>}
        {props.meeting.manual_transfer && 
          <p>Please wait for the host to open breakouts on Zoom.</p>}
        {props.meeting.zoom_transfer && 
          <p>The host has created a new Zoom call with the breakouts pre-populated. Click above to join the call and enter your breakout session.</p>}
        </div>
      </div>
    </div>
  );
}

function HostView(props){
  const restore = () => {
    post(`/${props.meeting.slug}/restore`, {});
  }

  return (
    <div className="modal-dialog modal-dialog-centered modal-dialog-host" role="document">
      <div className="modal-content align-middle">
        {props.meeting.manual_transfer && <ManualTransfer restore={restore} {... props} />}
        {props.meeting.zoom_transfer && <ZoomCallCreation restore={restore} {... props} />}
      </div>
    </div>
  );
}

function ZoomCallCreation(props){
  return (
    <div className="modal-body">
      <h4 className="modal-title text-center">
        {props.userRegistration.join_url && 
          <p><a href={props.userRegistration.join_url} target="_blank" 
            className="btn btn-primary btn-lg">Click here to join the call</a></p>}
        {!props.userRegistration.join_url && 'Creating Zoom call, registering participants...'}
      </h4>

      {!props.userRegistration.join_url &&
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>}

      {props.userRegistration.join_url && 
        <div>
          <p>Your participants will now be prompted to return to Zoom. If you want to discard this call and start a new Unbreakout session, click the button below.</p>
          <span></span>
          <div className="text-center">
            <p><a onClick={props.restore} className="btn btn-outline-dark">Return to Unbreakout</a></p>
          </div>
        </div>}

    </div>
  );
}


function ManualTransfer(props){
  const {breakouts = []} = props.meeting;

  return (
    <div>
      <div className="modal-header">
        <h4 className="modal-title text-center">List of Rooms and Participants</h4>
      </div>
      <div className="modal-body">
        <div className="accordion" id="accordion">
          <p>Click <strong>"Breakout Rooms"</strong> in your existing Zoom call. Select <strong>"Assign manually"</strong> and select the number of breakout rooms below. Rename them to match the breakouts below, and press <strong>"Assign"</strong> to assign participants to their breakouts.</p>
          <p>When you're ready, click <strong>"Open All Rooms"</strong>.</p>
          <span></span>
          {props.noBreakouts
            ? <p className="text-center"><i>No breakouts to display or all breakouts are empty!</i></p>
            : breakouts.map( breakout => 
              <BreakoutCard dataParent="accordion" key={breakout.id} breakout={breakout} {...props} />)
          }
        </div>
      </div>
      <div className="modal-footer">
        <p><a className="btn btn-outline-dark" onClick={props.restore} data-dismiss="modal">
          Return to Unbreakout
        </a></p>
      </div>
    </div>
  );
}

function BreakoutCard(props){
  const {id, title, participants} = props.breakout;
  const names = participants.map(registrant => registrant.name.substring(3))
    .sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());});
  const [collapsed, setCollapsed] = useState(names.length == 0);
  return (
    <div className="card">
      <div className="card-header" id={id}>
        <h2 className="mb-0">
          <button className={"btn btn-link btn-block text-left" + (names.length == 0 ? " disabled" : "")}
            type="button" onClick={() => setCollapsed(!collapsed)}
            aria-expanded="true" aria-controls="collapseone">
            <b>{title}</b> {" (" + names.length + ")"}
          </button>
        </h2>
      </div>

      <div id={id} className={collapsed ? "collapse hide" : "collapse show"} aria-labelledby="headingone" data-parent={props.dataParent} >
        <div className="card-body">
          <ul className="list-group list-group-flush">
            {names.map(name => <li className="list-group-item">{name}</li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}
