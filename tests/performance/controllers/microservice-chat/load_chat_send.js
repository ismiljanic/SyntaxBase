import ws from 'k6/ws';
import { Trend } from 'k6/metrics';
import { check } from 'k6';

export let messageLatency = new Trend('chat_message_latency');

export let options = {
  stages: [
    { duration: '10s', target: 50 },
    { duration: '20s', target: 2000 },
    { duration: '20s', target: 5000 },
    { duration: '30s', target: 0 },
  ]
};

export default function () {
  const url = 'ws://localhost:8100/ws/websocket';
  //mock token taken from frontend
  const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkF6VmNtV2pDOVR3MUdkSEZuV202QyJ9.eyJodHRwczovL1N5bnRheEJhc2UuY29tL3JvbGVzIjpbXSwiaXNzIjoiaHR0cHM6Ly9kZXYtYXppbThzZnUyeXo2a3p5cC51cy5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMTA2MzA4MzczOTg4Njg3NjI3NTIiLCJhdWQiOlsiaHR0cHM6Ly9kZXYtYXppbThzZnUyeXo2a3p5cC51cy5hdXRoMC5jb20vYXBpL3YyLyIsImh0dHBzOi8vZGV2LWF6aW04c2Z1Mnl6Nmt6eXAudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTc2NjQ5OTM3NiwiZXhwIjoxNzY2NTg1Nzc2LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIHJlYWQ6Y3VycmVudF91c2VyIHVwZGF0ZTpjdXJyZW50X3VzZXJfbWV0YWRhdGEgb2ZmbGluZV9hY2Nlc3MiLCJhenAiOiJnMTFSSTlyRkVMSmVZSUp5SWJEcUtESEVPaXZXaGRnRSJ9.MVfMvLDgEcJm-Z_DSpnkwAPtxVTZqYX65acAlEPFwThbLQGLejugqbUqsqjfQm6Mv4VWgepiicD06OzKaDoaSV6ePMih8D8vMrsCe9N1tHJ_cg3j5gJrzD1c15Sn1RWYvl-NcjKal3HInouSkag6Se6_qOnEC9NiGmgUBs2F8czjVazVl5nPL341aYmzyQcfF-Bsmza8rqclOD-W5NMxwXtOA-rR54kQnpPCujPEY0WSzaTOG-gdRDczOVqzvyPQtwoiaq7GT3WJkqv-O8emmArW2Jys2Cg7eHRoUzQdAcYZbtaZm43_j0oq9_BPLW_h_LA97qeEVsZIQeJ3fCGmBA';

  const res = ws.connect(url, {}, function (socket) {
    socket.on('open', () => {
      // STOMP CONNECT
      socket.send(
        `CONNECT\nAuthorization:Bearer ${token}\naccept-version:1.2\n\n\u0000`
      );

      // SUBSCRIBE
      socket.send(
        `SUBSCRIBE\nid:sub-0\ndestination:/topic/chat.userA.userB\n\n\u0000`
      );

      const start = Date.now();

      // SEND message
     socket.send(
       `SEND\ndestination:/app/chat.send\ncontent-type:application/json\nAuthorization:Bearer ${token}\n\n` +
       JSON.stringify({
         fromUserId: 'userA',
         fromUserUsername: 'Alice',
         toUserId: 'userB',
         toUserUsername: 'Bob',
         content: 'hello',
       }) +
       `\u0000`
     );

      socket.on('message', () => {
        messageLatency.add(Date.now() - start);
      });
    });

    socket.setTimeout(() => socket.close(), 5000);
  });

  check(res, { 'connected': r => r && r.status === 101 });
}