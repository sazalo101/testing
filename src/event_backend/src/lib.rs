use candid::{CandidType,Deserialize};
use std::collections::HashMap;

#[derive(CandidType,Deserialize,Clone)]
 
struct Event{
       id:u64,
       name:String,
       date:String,
}
static mut EVENT:Option<HashMap<u64,Event>>=None;
static mut NEXT_ID:u64 =1;
#[ic_cdk::init]
fn init(){
    unsafe{
        EVENT=Some(HashMap::new());
    }
}

#[ic_cdk::query]
fn get_event(event_id:u64)->Option<Event>{
    unsafe{
     EVENT.as_ref().unwrap().get(&event_id).cloned()
    }
}
#[ic_cdk::update]
fn add_event(name:String,date:String)->u64{
    let event_id=unsafe{NEXT_ID};
    let event=Event{
        id:event_id,
        name,
        date,
    };
    unsafe{
        EVENT.as_mut().unwrap().insert(event_id ,event);
        NEXT_ID +=15;
    }
    event_id
}
ic_cdk::export_candid!();