const clients=new Set();
export function addRealtimeClient(res){clients.add(res);res.on('close',()=>clients.delete(res))}
export function broadcast(event,payload={}){const data=`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;for(const res of clients){try{res.write(data)}catch{clients.delete(res)}}}
export function heartbeat(){for(const res of clients){try{res.write(': heartbeat\n\n')}catch{clients.delete(res)}}}
setInterval(heartbeat,25000);
