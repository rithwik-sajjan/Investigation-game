import { useState, useEffect, useRef, useCallback } from "react";

const EVIDENCE_DB = {
  fingerprint_glass: { id:"fingerprint_glass", name:"Whiskey Glass Print", icon:"🥃", location:"crime_scene", category:"forensic", rarity:"common", desc:"A crystal whiskey glass near the body. Partial thumb loop print on the rim — applied with some force.", analyzed:false, found:false, result:"Loop pattern, right thumb. High confidence match to PRIYA SHARMA (CFO) — her prints are on file from a 2021 security clearance.", detail:"The glass still had 2 fingers of whiskey in it. The victim's glass was empty. Someone poured themselves a drink.", leads:["priya"] },
  fingerprint_door: { id:"fingerprint_door", name:"Door Handle Print", icon:"🚪", location:"crime_scene", category:"forensic", rarity:"uncommon", desc:"Smudged latent print on the interior door handle. Partial, but recoverable.", analyzed:false, found:false, result:"Composite of two overlapping prints. One matches VIKRAM NAIR. Second is unidentified — possibly gloved.", detail:"The killer likely touched the door while leaving. Vikram was here — but was he leaving or was someone else using his entry to frame him?", leads:["vikram"] },
  dna_nails: { id:"dna_nails", name:"Subungual DNA", icon:"🧬", location:"crime_scene", category:"forensic", rarity:"rare", desc:"Trace biological matter recovered from under the victim's fingernails. Rajesh fought back.", analyzed:false, found:false, result:"DNA profile: VIKRAM NAIR. Confidence 99.7%. There was a physical altercation.", detail:"Rajesh scratched his attacker. Vikram's skin cells are conclusive. But the question is — was Vikram the killer, or was he in a separate fight earlier?", leads:["vikram"] },
  blood_spatter: { id:"blood_spatter", name:"Blood Spatter Pattern", icon:"🩸", location:"crime_scene", category:"forensic", rarity:"rare", desc:"Arterial spatter on the east wall. Pattern is high-velocity, directional.", analyzed:false, found:false, result:"Victim was struck from the left. Attacker was approximately 165–170cm tall, right-handed. Rules out Aryan Kapoor (185cm, left-handed). Consistent with Priya Sharma.", detail:"The physics of the spatter tell a story. The killer stood close — this was personal, not a robbery gone wrong.", leads:["priya"] },
  cctv_gap: { id:"cctv_gap", name:"CCTV Footage Gap", icon:"📹", location:"crime_scene", category:"digital", rarity:"uncommon", desc:"12-minute gap in security footage, 11:34–11:46 PM. Suspiciously precise.", analyzed:false, found:false, result:"The deletion was performed from a registered admin terminal — Terminal ID 7. That terminal is assigned to RAVI DESAI, Head of Security.", detail:"Someone knew where the cameras were. This wasn't random — it was planned. Ravi Desai either did this, or someone used his credentials.", leads:["ravi"] },
  phone_records: { id:"phone_records", name:"Victim's Call Log", icon:"📱", location:"crime_scene", category:"digital", rarity:"uncommon", desc:"Rajesh's phone was wiped, but the SIM card had residual metadata.", analyzed:false, found:false, result:"Last call at 11:21 PM, duration 4 minutes. Outgoing to an unregistered burner number. Second-to-last call: PRIYA SHARMA at 9:44 PM, duration 18 seconds — she hung up.", detail:"Rajesh tried to reach someone in his final hour. The burner number traces back to a cell tower near the abandoned warehouse. Who was he calling?", leads:["priya","unknown"] },
  documents_embezzle: { id:"documents_embezzle", name:"Forged Bank Transfers", icon:"📄", location:"suspects_office", category:"documentary", rarity:"rare", desc:"Ledger sheets hidden in a false-bottom drawer. $2.3 million rerouted through shell companies over 8 months.", analyzed:false, found:false, result:"Transfers authorized using a forged digital signature. The accounting style and shell company naming convention match PRIYA SHARMA'S known financial filings.", detail:"This is the motive made visible. Rajesh found out. He called Priya that night. She had 18 seconds to decide what to do.", leads:["priya"] },
  laptop_encrypted: { id:"laptop_encrypted", name:"Encrypted Laptop", icon:"💻", location:"suspects_office", category:"digital", rarity:"rare", desc:"Laptop found in Priya's office, hidden behind a loose ceiling tile. Password protected.", analyzed:false, found:false, result:"Decryption reveals correspondence with VIKRAM NAIR discussing 'eliminating the Rajesh problem' — dated 3 days before the murder.", detail:"They planned this together. Priya provided the financial motive, Vikram provided the legal cover. But who swung first?", leads:["priya","vikram"] },
  witness_guard: { id:"witness_guard", name:"Guard Ramu's Statement", icon:"👮", location:"police_station", category:"testimonial", rarity:"common", desc:"Security guard Ramu Prasad was on duty. He's reluctant to talk — seems frightened.", analyzed:false, found:false, result:"Ramu saw a woman in a red wool coat exit the building at 11:47 PM. She was walking fast, head down. He recognized her perfume — Chanel No. 5.", detail:"Ramu hesitated before giving this statement. He later admitted Ravi Desai told him to 'stay quiet'. Something is being covered up.", leads:["priya","ravi"] },
  witness_cleaner: { id:"witness_cleaner", name:"Cleaning Staff Statement", icon:"🧹", location:"police_station", category:"testimonial", rarity:"uncommon", desc:"Night cleaner Sunita was working the 12th floor at 11:30 PM. She heard raised voices above her.", analyzed:false, found:false, result:"Sunita heard at least TWO voices arguing — a man and a woman. She heard the word 'testimony' and 'you'll regret this'. The man's voice was deep, the woman's high-pitched.", detail:"Two people were in that office. Not just the killer and the victim. There were THREE people in the room.", leads:["vikram","priya"] },
  audio_recorder: { id:"audio_recorder", name:"Broken Voice Recorder", icon:"🎙", location:"abandoned_warehouse", category:"audio", rarity:"legendary", desc:"Smashed recorder stuffed behind a brick. Someone tried hard to destroy this.", analyzed:false, found:false, result:"Recovered 43 seconds of audio: 'Rajesh, if you testify against us in the Mehrotra case, your daughter pays the price.' The voice is VIKRAM NAIR with 94% confidence via spectrograph.", detail:"Vikram threatened the victim's daughter. This was organized — the Mehrotra corruption case connects to half of Mumbai's elite. This goes higher than Priya and Vikram.", leads:["vikram"] },
  ravi_bribe: { id:"ravi_bribe", name:"Cash Envelope", icon:"💰", location:"abandoned_warehouse", category:"physical", rarity:"uncommon", desc:"Thick envelope with ₹5,00,000 in cash. No prints, but a business card tucked inside.", analyzed:false, found:false, result:"The business card belongs to RAVI DESAI, Head of Bank Security. Bank serial numbers trace the cash to Apex Bank's petty cash account — controlled by Priya Sharma.", detail:"Ravi was paid to kill the CCTV footage. He's not the murderer, but he's complicit. He's also terrified. The right pressure could flip him.", leads:["ravi","priya"] },
  red_coat_fiber: { id:"red_coat_fiber", name:"Red Wool Fiber", icon:"🔴", location:"crime_scene", category:"forensic", rarity:"uncommon", desc:"Single red wool fiber snagged on the victim's desk corner, caught at height ~165cm.", analyzed:false, found:false, result:"Cashmere blend, premium grade. Matches Priya Sharma's red Burberry coat purchased at Palladium Mall in October 2023. Her social media has 3 photos wearing it.", detail:"She was there. The fiber height matches her build. This is physical evidence that places her in the room — not just near the building.", leads:["priya"] },
  vikram_alibi_hole: { id:"vikram_alibi_hole", name:"Hotel Receipt Discrepancy", icon:"🧾", location:"police_station", category:"documentary", rarity:"uncommon", desc:"Vikram claims he was at Taj Hotel until 10 PM. You subpoenaed the restaurant records.", analyzed:false, found:false, result:"Vikram's table was cleared at 9:41 PM — over an hour earlier than claimed. The hotel is 22 minutes from the crime scene by car. He had time.", detail:"His alibi is a lie. He left the dinner early. 78 unaccounted minutes. Enough time to threaten Rajesh, get physical, and leave before Priya arrived to finish what they started.", leads:["vikram"] },
  aryan_motive: { id:"aryan_motive", name:"Buyout Dispute Email", icon:"📧", location:"suspects_office", category:"documentary", rarity:"common", desc:"Email thread between Aryan Kapoor and Rajesh, recovered from Aryan's work account.", analyzed:false, found:false, result:"3-week-old email chain. Aryan demanded a 40% valuation cut. Rajesh refused. Final email from Aryan: 'You will regret this decision, Rajesh. I promise you that.'", detail:"Aryan had motive and sent an explicit threat. But his Delhi flight checks out — Air India AI-202, boarded 6:05 PM, seat 12A, confirmed by cabin crew. He's clean.", leads:["aryan"] },
};

const SUSPECTS_DB = {
  priya: { id:"priya", name:"Priya Sharma", role:"CFO, Apex Bank", age:41, icon:"👩", build:"165cm, slim", guilty:true, accessory:false, motive:"Embezzling $2.3M. Rajesh discovered the scheme and threatened to go to the board.", alibi:"Claims she was home, alone, all night. Unverified.", knownFacts:["Was Rajesh's most trusted executive","Recently purchased a ₹4Cr apartment on a CFO salary","Owns a red Burberry coat"], breakpoint:["fingerprint_glass","documents_embezzle","red_coat_fiber"], confession:"Alright. ALRIGHT. I took the money — over two years, slowly. Rajesh called me that evening. He'd found the ledgers. I drove to the office. We argued. Vikram arrived — he was supposed to scare him into silence. But Rajesh lunged for the phone to call the police and I... I pushed him. He fell. He hit his head on the desk corner. I didn't plan to kill him. I swear to God I didn't plan it.", questions:{q1:{text:"Where were you between 10 PM and midnight?",base:"Home. Reading. I had an early morning the next day, Inspector.",pressure:"I've told you — HOME. Are you accusing me of something? I want this on record that I'm cooperating voluntarily.",ev:"witness_guard",ev_resp:"A red coat? Inspector, you're grasping at threads. Half the women in this city own red coats. I was HOME."},q2:{text:"When did you last speak with Rajesh?",base:"Earlier that afternoon. A routine budget call. Nothing unusual.",pressure:"Fine — he called at 9:44 PM. It was brief. He seemed stressed about something but wouldn't say what. I assumed it was board pressure.",ev:"phone_records",ev_resp:"Yes, he called. For 18 seconds. He started saying something about 'numbers not adding up' and I — I got another call. I had to hang up. That was the last time I spoke to him."},q3:{text:"We found wool fibers on the victim's desk. Cashmere, red.",base:"I... that's not possible. I wasn't there.",pressure:"Lots of people visit Rajesh's office. It could be from any time.",ev:"red_coat_fiber",ev_resp:"[long silence] ...One fiber. From weeks ago. I had a meeting with him last week, we went over Q3 reports at his desk. That explains it perfectly."},q4:{text:"Walk me through the shell company transfers.",base:"I don't know what you're talking about. Our accounts are audited quarterly.",pressure:"Inspector, I will not sit here and be accused of financial crimes without legal representation present.",ev:"documents_embezzle",ev_resp:"[hands trembling] Those... transfers were authorized. I had... discretionary budget authority for certain investments. Rajesh approved them. He approved everything. [voice cracks] I want a lawyer."}}},
  vikram: { id:"vikram", name:"Vikram Nair", role:"Senior Legal Counsel, Apex Bank", age:46, icon:"🧔", build:"178cm, athletic", guilty:false, accessory:true, motive:"Threatened Rajesh to prevent testimony in the Mehrotra corruption case — a case that would destroy his career and several powerful clients.", alibi:"Dinner at Taj Hotel until 10 PM. Has a receipt — but it ends at 9:41 PM, not 10 PM.", knownFacts:["Lead attorney in the Mehrotra corruption case","Has a recorded history of intimidating witnesses","Known to carry a burner phone"], breakpoint:["audio_recorder","dna_nails","vikram_alibi_hole"], confession:"I was there. I got there around 10:30. I threatened him — with his daughter, yes. I'm not proud. He attacked me, we struggled, that's how my DNA is there. But he was ALIVE when I left. Priya arrived as I was leaving. I saw her in the lobby. She had that look on her face. I knew something was wrong but I left anyway. I left and I said nothing. That's my crime — not murder. Complicity. Cowardice.", questions:{q1:{text:"Your alibi places you at Taj until 10 PM. Confirm?",base:"Correct. I have the receipt right here. Table 14, party of three, departed 10:05 PM.",pressure:"I've given you documentation. What more do you want?",ev:"vikram_alibi_hole",ev_resp:"[jaw tightens] ...The receipt says what it says. Maybe the kitchen closed early. The point is I was at that dinner."},q2:{text:"Was your DNA under the victim's fingernails by accident?",base:"I haven't been in Rajesh's private office in months. Your lab made an error.",pressure:"DNA labs make mistakes. I'd recommend you re-run the test before making accusations that could end careers.",ev:"dna_nails",ev_resp:"We had a meeting. Three days ago. It got heated — professionally heated. He grabbed my arm. That's how the DNA transferred. It's that simple."},q3:{text:"We have a voice recording. You threatened his daughter.",base:"A recording? Of what? That's absurd. I want to hear this alleged recording.",pressure:"I categorically deny any such statement. Produce this recording or stop wasting my time.",ev:"audio_recorder",ev_resp:"[face drains of color] I... that was a negotiation tactic. Legal posturing. I never intended to actually — I want my lawyer. Right now. Not another word."},q4:{text:"Did you see Priya Sharma that night?",base:"No. I was at dinner, then home. I don't know what Priya was doing.",pressure:"We're not colleagues who socialize outside of work, Inspector.",ev:"laptop_encrypted",ev_resp:"[long pause, eyes close] ...I may have seen her car. In the vicinity. I'm not certain. I need to speak with my lawyer before continuing."}}},
  ravi: { id:"ravi", name:"Ravi Desai", role:"Head of Security, Apex Bank", age:38, icon:"🕶", build:"172cm, stocky", guilty:false, accessory:true, motive:"Bribed ₹5L to delete 12 minutes of CCTV footage on the night of the murder.", alibi:"Was in the security control room all night — except for a 15-minute break at 11:30 PM.", knownFacts:["Has admin access to all bank security systems","Was passed over for promotion twice — Priya blocked both"], breakpoint:["cctv_gap","ravi_bribe"], confession:"She offered me five lakhs. Said it was to cover an embarrassing client situation. I didn't ask questions. I needed the money — my mother's dialysis. I deleted 12 minutes. I didn't know someone was going to die. When I realized what had happened, I was in too deep. The guard Ramu — I told him to stay quiet because I was scared. Not because I killed anyone.", questions:{q1:{text:"Terminal 7 deleted footage at 11:34 PM. That's your terminal.",base:"My terminal is logged into by multiple staff on rotation. Anyone could have used it.",pressure:"I can provide a full roster of who had access to that room. This is a serious accusation.",ev:"cctv_gap",ev_resp:"[shifts in seat] ...I take breaks. Someone could have accessed it then. I'm not the only one with keys."},q2:{text:"We found an envelope with your card and five lakh rupees.",base:"I don't know anything about that.",pressure:"I've never been to any warehouse. This is fabricated.",ev:"ravi_bribe",ev_resp:"[long silence, face pale] ...I can explain that. It's not what it looks like. The money was a — a personal loan. Between friends. I'm not a criminal."},q3:{text:"You told guard Ramu to stay quiet. Why?",base:"I gave Ramu standard protocol instructions. Don't speak to media, don't speculate. Normal procedure.",pressure:"Every security department issues these guidelines after an incident on premises. It's liability management.",ev:"witness_guard",ev_resp:"[voice drops] I told him it wasn't relevant. That he'd only confuse the investigation. I was wrong to do that. I know how it looks."}}},
  aryan: { id:"aryan", name:"Aryan Kapoor", role:"Co-Founder & Business Partner", age:49, icon:"🧑‍💼", build:"185cm, broad", guilty:false, accessory:false, motive:"Bitter valuation dispute over a ₹800Cr buyout. Sent Rajesh a threatening email three weeks prior.", alibi:"Delhi flight AI-202. Departed 6:05 PM, confirmed by cabin crew and seat records.", knownFacts:["12-year business partner and childhood friend","The buyout would net him ₹200Cr more if Rajesh was gone","His wife filed for divorce last month — financial pressure mounting"], breakpoint:[], confession:null, questions:{q1:{text:"Your email said Rajesh would 'regret' his decision.",base:"That was frustration talking. 12 years of partnership and he wouldn't even meet me halfway. I chose poor words. I didn't mean it literally.",pressure:"Every business relationship has heated moments. I challenge you to show me one long-term partnership that doesn't.",ev:"aryan_motive",ev_resp:"[sighs] Yes. I wrote that. I'm not proud. It was 2 AM and I'd had a few drinks. Rajesh knew me — he knew it was just anger."},q2:{text:"The buyout becomes significantly easier with Rajesh gone.",base:"That's a grotesque way to look at it. He was my oldest friend. We grew this company from nothing.",pressure:"I understand how it looks, Inspector. I do. But I was in Delhi. My alibi is airtight. I didn't do this.",ev:"documents_embezzle",ev_resp:"I suspected something was wrong with the accounts for months. Rajesh kept delaying the buyout valuation. Now I understand why — Priya was bleeding the company dry and he was trying to cover it before the deal closed."},q3:{text:"Did you know about the Mehrotra case?",base:"Rajesh mentioned it once. Said Vikram was handling some sensitive legal exposure. I didn't ask for details.",pressure:"I stay out of legal matters. That's what we have counsel for.",ev:"audio_recorder",ev_resp:"If Vikram threatened Rajesh over a corruption case... God. There's so much I didn't know. I was focused on the buyout and I missed everything that was happening around me."}}}
};

const LOCATIONS_DB = {
  crime_scene: { name:"Crime Scene", icon:"🔍", shortDesc:"14th floor private office. Tape. Silence. Secrets.", fullDesc:"The office is frozen in time. A overturned Chesterfield chair. Shattered crystal on Persian carpet. Rajesh's mahogany desk is smeared with dried blood on the right corner edge. The city glitters cold outside the floor-to-ceiling windows. Something happened here between 11:30 and midnight. Every detail is a word in a sentence you haven't finished reading yet.", atmosphere:"🌧 Rain hammers the windows. The smell of whiskey and iron.", evidenceHere:["fingerprint_glass","fingerprint_door","dna_nails","blood_spatter","phone_records","red_coat_fiber","cctv_gap"] },
  forensic_lab: { name:"Forensic Lab", icon:"🔬", shortDesc:"Analysis hub. Dr. Kavya runs it.", fullDesc:"Dr. Kavya Pillai doesn't look up when you enter. She's already wearing gloves. The lab smells of chemical reagents and recycled air. Three centrifuges hum in rotation. A spectrograph analyzer blinks in the corner. Whatever you bring her, she'll find the truth in it — she always does. 'Leave it on the tray,' she says. 'Come back in ten minutes.'", atmosphere:"⚗️ Cold. Clinical. No mercy for lies.", evidenceHere:[] },
  police_station: { name:"Police Station", icon:"🚔", shortDesc:"Home base. Files, coffee, pressure.", fullDesc:"HQ at 2 AM has a different energy — half the fluorescent lights are out, and the ones that remain flicker like they're nervous. The front desk sergeant nods at you. Case file 001 is open on your desk, growing heavier by the hour. Two witnesses have agreed to give statements. The Commissioner called twice. Everyone wants this closed.", atmosphere:"☕ Cold chai. Flickering lights. Unanswered phones.", evidenceHere:["witness_guard","witness_cleaner","vikram_alibi_hole","aryan_motive"] },
  suspects_office: { name:"Apex Bank HQ", icon:"🏦", shortDesc:"Corporate. Cold. Hiding things.", fullDesc:"The 34-storey glass tower is technically a crime scene annex, but business continues. Executives walk past with eyes down. Priya's office is sealed but you have a warrant. Aryan has flown back from Delhi and is sitting in the conference room with his lawyer. The desk drawers feel heavy — like they know what's inside them.", atmosphere:"🏙 Glass walls, paper trails, guilty people in expensive suits.", evidenceHere:["documents_embezzle","laptop_encrypted","aryan_motive"] },
  abandoned_warehouse: { name:"Abandoned Warehouse", icon:"🏚", shortDesc:"A tip. Dark. Damp. Full of answers.", fullDesc:"The anonymous tip came through at 3:17 AM — just a pin dropped on WhatsApp from a burner number. The warehouse on Dharavi Road used to be a textile mill. Now it's mold and shadows and the echo of your footsteps. Your flashlight catches something behind a loose brick. And then another thing. Someone used this place for planning.", atmosphere:"🌑 Pitch dark. Rats scatter. Your torch beam is the only honest thing here.", evidenceHere:["audio_recorder","ravi_bribe"] },
};

const LOG_TEMPLATES = {
  arrive: (loc) => [`📍 Arrived at ${loc}. Your eyes adjust. The air tastes like secrets.`, `🚶 You push through the door. ${loc}. Whatever's here — you'll find it.`, `🔦 ${loc}. You scan the room slowly. Something is always hiding in plain sight.`],
  collect: (ev) => [`📦 Got it. ${ev} secured in evidence bag. Don't lose the chain of custody.`, `🧤 Carefully bagged: ${ev}. Every piece of the puzzle matters.`, `✅ ${ev} collected. The case just got heavier — in a good way.`, `🔍 ${ev} in hand. One more thread in a web you're starting to see.`],
  analyze: (ev, result) => [`🔬 Lab results in. ${ev}: "${result}"`, `⚗️ Dr. Kavya hands you the printout. ${ev}: "${result}" Your pulse quickens.`, `📋 Analysis complete on ${ev}. The science doesn't lie: "${result}"`],
  interrogate: (name) => [`🗣 ${name} sits across the table. The chair creaks. You begin.`, `💡 Interrogation room 2. ${name} looks calm. Too calm.`, `🔒 Door locked. Recording active. ${name} asked for water. Good — thirsty people talk.`],
  pressure: (name) => [`⚡ You slide the evidence across the table. ${name}'s jaw tightens.`, `🧨 Pressure applied. ${name} doesn't crack easily — but everyone cracks eventually.`, `😰 ${name} shifts in the chair. You can see it — the calculation behind the eyes.`],
  arrest: (name) => [`⚖️ You read the rights. ${name} says nothing. The cuffs click.`, `🚨 Arrest made. ${name} is in custody. Now comes the hard part — proving it.`],
  timer: (mins) => [`⏱ ${mins} minutes left. The city doesn't wait for justice.`, `⚠️ Clock ticking. ${mins} minutes. Move faster.`],
};

function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

const RANKS_LIST = [
  { min:-100, title:"Disgraced Officer", stars:0, color:"#aa3333" },
  { min:0, title:"Constable", stars:1, color:"#888" },
  { min:60, title:"Sub-Inspector", stars:2, color:"#aaa" },
  { min:130, title:"Inspector", stars:3, color:"#cc8844" },
  { min:230, title:"Senior Inspector", stars:4, color:"#ccaa44" },
  { min:380, title:"Superintendent", stars:5, color:"#44aacc" },
];
function getRank(rep) { return [...RANKS_LIST].reverse().find(r => rep >= r.min) || RANKS_LIST[0]; }

function MiniMap({ current, onSelect }) {
  const locs = Object.entries(LOCATIONS_DB);
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
      {locs.map(([k,l]) => {
        const uncollected = l.evidenceHere?.filter(id => !EVIDENCE_DB[id]?.found).length || 0;
        const isActive = current === k;
        return (
          <button key={k} onClick={() => onSelect(k)} style={{ background: isActive ? "#1c0800" : "#0d0d0d", border:`1px solid ${isActive ? "#cc4422" : "#1e1e1e"}`, borderRadius:8, padding:"10px 12px", cursor:"pointer", textAlign:"left", fontFamily:"monospace", transition:"all 0.2s" }}>
            <div style={{ fontSize:16, marginBottom:3 }}>{l.icon}</div>
            <div style={{ fontSize:11, color: isActive ? "#ff8866" : "#aaa", fontWeight: isActive ? 600 : 400 }}>{l.name}</div>
            <div style={{ fontSize:9, color:"#444", marginTop:2 }}>{l.atmosphere.slice(0,30)}</div>
            {uncollected > 0 && <div style={{ marginTop:4, fontSize:9, color:"#cc8844", letterSpacing:1 }}>◆ {uncollected} ITEM{uncollected>1?"S":""} UNDETECTED</div>}
            {uncollected === 0 && l.evidenceHere?.length > 0 && <div style={{ marginTop:4, fontSize:9, color:"#2a5a2a" }}>✓ CLEARED</div>}
          </button>
        );
      })}
    </div>
  );
}

function EvidenceCard({ ev, onCollect, onAnalyze, isLab }) {
  const rarityColor = { common:"#558855", uncommon:"#5588cc", rare:"#9955cc", legendary:"#cc8833" };
  return (
    <div style={{ background:"#0d0d0d", border:`1px solid ${ev.analyzed ? "#1a3a1a" : ev.found ? "#2a1a00" : "#181818"}`, borderRadius:9, padding:"11px 14px", marginBottom:8, transition:"border 0.3s" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:18 }}>{ev.icon}</span>
          <div>
            <div style={{ fontSize:12, color: ev.analyzed ? "#88cc88" : ev.found ? "#cc9955" : "#555", fontWeight:600 }}>{ev.name}</div>
            <div style={{ fontSize:9, color: rarityColor[ev.rarity] || "#888", letterSpacing:1 }}>{ev.rarity?.toUpperCase()} · {ev.category?.toUpperCase()}</div>
          </div>
        </div>
        <div style={{ fontSize:9, color:"#333" }}>{LOCATIONS_DB[ev.location]?.name}</div>
      </div>
      {ev.found && <div style={{ fontSize:10, color:"#777", lineHeight:1.6, marginBottom:6, borderLeft:"2px solid #2a2a2a", paddingLeft:8 }}>{ev.desc}</div>}
      {ev.analyzed && (
        <div>
          <div style={{ fontSize:10, color:"#5aaa5a", lineHeight:1.6, borderLeft:"2px solid #1a4a1a", paddingLeft:8, marginBottom:4 }}>📋 <b>Result:</b> {ev.result}</div>
          <div style={{ fontSize:9, color:"#7a6a4a", lineHeight:1.6, borderLeft:"2px solid #3a2a1a", paddingLeft:8, fontStyle:"italic" }}>💭 {ev.detail}</div>
        </div>
      )}
      {!ev.found && <div style={{ fontSize:9, color:"#2a2a2a" }}>Not yet collected · {LOCATIONS_DB[ev.location]?.name}</div>}
      {isLab && ev.found && !ev.analyzed && (
        <button onClick={() => onAnalyze(ev.id)} style={{ marginTop:8, width:"100%", background:"#0a1a0a", border:"1px solid #1a4a1a", borderRadius:5, padding:"6px", color:"#5aaa5a", fontSize:11, cursor:"pointer", fontFamily:"monospace" }}>🔬 Run Analysis</button>
      )}
      {!isLab && !ev.found && (
        <button onClick={() => onCollect(ev.id)} style={{ marginTop:8, width:"100%", background:"#100800", border:"1px solid #3a1a00", borderRadius:5, padding:"6px", color:"#cc8844", fontSize:11, cursor:"pointer", fontFamily:"monospace" }}>📦 Collect Evidence</button>
      )}
    </div>
  );
}

function SuspectCard({ susp, evidenceAnalyzed, onInterrogate, onArrest }) {
  const leadsTo = Object.values(EVIDENCE_DB).filter(e => e.analyzed && e.leads?.includes(susp.id));
  const heatLevel = leadsTo.length;
  const heatColor = heatLevel >= 3 ? "#cc4444" : heatLevel >= 2 ? "#cc8844" : heatLevel >= 1 ? "#aaaa44" : "#444";
  return (
    <div style={{ background:"#0d0d0d", border:`1px solid ${heatLevel >= 2 ? "#3a1a00" : "#1a1a1a"}`, borderRadius:10, padding:14, marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ fontSize:28 }}>{susp.icon}</div>
          <div>
            <div style={{ fontSize:13, color:"#eee", fontWeight:600 }}>{susp.name}</div>
            <div style={{ fontSize:10, color:"#666" }}>{susp.role} · {susp.age}y · {susp.build}</div>
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:9, color: heatColor, letterSpacing:1 }}>HEAT: {"█".repeat(heatLevel)}{"░".repeat(Math.max(0,4-heatLevel))}</div>
          <div style={{ fontSize:9, color:"#444" }}>{leadsTo.length} evidence link{leadsTo.length!==1?"s":""}</div>
        </div>
      </div>
      <div style={{ fontSize:10, color:"#666", marginBottom:6, lineHeight:1.6, borderLeft:"2px solid #2a2a2a", paddingLeft:8 }}><b style={{ color:"#888" }}>Alibi:</b> {susp.alibi}</div>
      {leadsTo.length > 0 && (
        <div style={{ marginBottom:8 }}>
          <div style={{ fontSize:9, color:"#555", marginBottom:4, letterSpacing:1 }}>LINKED EVIDENCE:</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
            {leadsTo.map(e => <span key={e.id} style={{ fontSize:9, background:"#1a1000", border:"1px solid #3a2a00", borderRadius:4, padding:"2px 6px", color:"#aa7733" }}>{e.icon} {e.name}</span>)}
          </div>
        </div>
      )}
      <div style={{ fontSize:10, color:"#555", marginBottom:8 }}>
        <b style={{ color:"#666" }}>Known:</b> {susp.knownFacts?.[0]}
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <button onClick={() => onInterrogate(susp.id)} style={{ flex:2, background:"#1a0a00", border:"1px solid #4a2200", borderRadius:6, padding:"7px", color:"#cc8844", fontSize:11, cursor:"pointer", fontFamily:"monospace" }}>🗣 Interrogate</button>
        <button onClick={() => onArrest(susp.id)} style={{ flex:1, background:"#1a0000", border:"1px solid #4a0000", borderRadius:6, padding:"7px", color:"#cc4444", fontSize:11, cursor:"pointer", fontFamily:"monospace" }}>⚖️ Arrest</button>
      </div>
    </div>
  );
}

function ClueBoard({ evidence, suspects }) {
  const analyzed = Object.values(evidence).filter(e => e.analyzed);
  const suspKeys = Object.keys(suspects);
  const connections = [];
  analyzed.forEach(ev => { ev.leads?.forEach(sid => { if(suspects[sid]) connections.push({ ev, sid }); }); });
  const suspHeat = {};
  suspKeys.forEach(sid => { suspHeat[sid] = connections.filter(c => c.sid === sid).length; });
  return (
    <div style={{ background:"#0a0a0a", borderRadius:10, padding:14 }}>
      {analyzed.length === 0 ? (
        <div style={{ color:"#333", fontSize:12, textAlign:"center", padding:"40px 0" }}>Analyze evidence to populate the clue board</div>
      ) : (
        <svg width="100%" viewBox="0 0 520 420" style={{ overflow:"visible" }}>
          <text x="10" y="18" fill="#444" fontSize="9" letterSpacing="2">EVIDENCE</text>
          <text x="340" y="18" fill="#444" fontSize="9" letterSpacing="2">SUSPECTS</text>
          {analyzed.map((ev, i) => {
            const y = 40 + i * 55;
            return (
              <g key={ev.id}>
                <rect x="10" y={y-16} width="160" height="34" rx="5" fill="#111" stroke="#222" strokeWidth="1"/>
                <text x="20" y={y} fill="#888" fontSize="10">{ev.icon} {ev.name}</text>
                <text x="20" y={y+12} fill="#555" fontSize="8">{ev.result?.slice(0,28)}...</text>
              </g>
            );
          })}
          {suspKeys.map((sid, i) => {
            const s = suspects[sid];
            const y = 50 + i * 95;
            const heat = suspHeat[sid] || 0;
            const col = heat >= 3 ? "#cc3333" : heat >= 2 ? "#cc7733" : heat >= 1 ? "#aaaa33" : "#444";
            return (
              <g key={sid}>
                <rect x="340" y={y-22} width="160" height="50" rx="6" fill="#111" stroke={col} strokeWidth={heat > 0 ? 1.5 : 0.5}/>
                <text x="350" y={y-6} fill={col} fontSize="11">{s.icon} {s.name}</text>
                <text x="350" y={y+8} fill="#555" fontSize="8">{s.role}</text>
                <text x="350" y={y+20} fill={col} fontSize="8">{"█".repeat(heat)}{"░".repeat(Math.max(0,4-heat))} {heat} link{heat!==1?"s":""}</text>
              </g>
            );
          })}
          {connections.map((c, idx) => {
            const evIdx = analyzed.findIndex(e => e.id === c.ev.id);
            const sIdx = suspKeys.indexOf(c.sid);
            if(evIdx < 0 || sIdx < 0) return null;
            const x1 = 170, y1 = 40 + evIdx * 55;
            const x2 = 340, y2 = 50 + sIdx * 95;
            const mx = (x1+x2)/2;
            const col = c.sid === "priya" ? "#cc4444" : c.sid === "vikram" ? "#4488cc" : c.sid === "ravi" ? "#aaaa44" : "#888";
            return (
              <g key={idx}>
                <path d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`} fill="none" stroke={col} strokeWidth="1.2" strokeDasharray="5,3" opacity="0.6"/>
                <text x={mx} y={(y1+y2)/2} textAnchor="middle" fill={col} fontSize="7" opacity="0.8">{c.ev.icon}</text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}

function Timeline({ evidence }) {
  const events = [
    { time:"09:44 PM", event:"Rajesh receives 18-second call from Priya. She hangs up abruptly.", unlocked: evidence.phone_records?.analyzed },
    { time:"10:00 PM", event:"Rajesh last seen by colleagues leaving the board meeting room.", unlocked: true },
    { time:"10:05 PM", event:"Vikram's dinner table cleared — 25 minutes earlier than his stated alibi.", unlocked: evidence.vikram_alibi_hole?.analyzed },
    { time:"11:21 PM", event:"Rajesh calls a burner number. 4 minutes. Last call he ever makes.", unlocked: evidence.phone_records?.analyzed },
    { time:"11:30 PM", event:"Cleaning staff Sunita hears a man and woman arguing loudly above her.", unlocked: evidence.witness_cleaner?.analyzed },
    { time:"11:34 PM", event:"CCTV footage deleted. Terminal 7. Ravi Desai's credentials.", unlocked: evidence.cctv_gap?.analyzed },
    { time:"11:47 PM", event:"Guard Ramu sees a woman in red coat exit fast. Head down.", unlocked: evidence.witness_guard?.analyzed },
    { time:"12:00 AM", event:"Janitor discovers the body. Rajesh Khanna, dead at his own desk.", unlocked: true },
    { time:"12:15 AM", event:"Police secure the scene. You're called in.", unlocked: true },
  ];
  return (
    <div>
      <div style={{ fontSize:10, color:"#555", letterSpacing:2, marginBottom:12 }}>RECONSTRUCTED TIMELINE</div>
      {events.map((e, i) => (
        <div key={i} style={{ display:"flex", gap:12, marginBottom:10, opacity: e.unlocked ? 1 : 0.25 }}>
          <div style={{ minWidth:58, fontSize:9, color: e.unlocked ? "#cc4444" : "#333", lineHeight:1.7, fontWeight:600 }}>{e.time}</div>
          <div style={{ flex:1 }}>
            <div style={{ width:"8px", height:"8px", borderRadius:"50%", background: e.unlocked ? "#cc4444" : "#333", display:"inline-block", marginRight:8, verticalAlign:"middle" }}/>
            <span style={{ fontSize:10, color: e.unlocked ? "#aaa" : "#333" }}>{e.unlocked ? e.event : "Locked — find more evidence"}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DetectiveGame() {
  const [screen, setScreen] = useState("intro");
  const [location, setLocation] = useState(null);
  const [evidence, setEvidence] = useState(() => JSON.parse(JSON.stringify(EVIDENCE_DB)));
  const [suspects] = useState(() => JSON.parse(JSON.stringify(SUSPECTS_DB)));
  const [reputation, setReputation] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600);
  const [logs, setLogs] = useState([]);
  const [tab, setTab] = useState("map");
  const [interrogating, setInterrogating] = useState(null);
  const [interrogLog, setInterrogLog] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [ending, setEnding] = useState(null);
  const [pressure, setPressure] = useState({});
  const [dayPhase, setDayPhase] = useState("night");
  const [arrestConfirm, setArrestConfirm] = useState(null);
  const timerRef = useRef(null);
  const logRef = useRef(null);

  const addLog = useCallback((msg, type="info") => {
    setLogs(prev => [...prev.slice(-60), { msg, type, id: Date.now()+Math.random(), time: new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}) }]);
  }, []);

  useEffect(() => {
    if (screen==="game" && !ending) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t<=1) { clearInterval(timerRef.current); triggerEnding("unsolved"); return 0; }
          if (t % 120 === 0) addLog(rnd(LOG_TEMPLATES.timer([Math.floor(t/60)])), "warn");
          setDayPhase(t % 4 < 2 ? "night" : "dawn");
          return t-1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [screen, ending]);

  useEffect(() => { if(logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [logs]);

  const analyzed = Object.values(evidence).filter(e => e.analyzed);
  const rank = getRank(reputation);
  const mins = Math.floor(timeLeft/60).toString().padStart(2,"0");
  const secs = (timeLeft%60).toString().padStart(2,"0");

  function triggerEnding(type, suspId) {
    clearInterval(timerRef.current);
    const endings = {
      perfect: { badge:"🏆", title:"The Mehrotra Conspiracy Unraveled", color:"#44aa44", rep:150, desc:`You built an airtight case. Priya Sharma arrested for first-degree murder. Vikram Nair charged as accessory and co-conspirator in the Mehrotra case. Ravi Desai turned state's evidence in exchange for reduced charges. The corruption case unravels half of Mumbai's financial elite. The Commissioner calls it the most thorough investigation in a decade. Rajesh Khanna's daughter receives a personal call from you.\n\nRank: ${getRank(reputation+150).title}` },
      good: { badge:"⭐", title:"Justice Served", color:"#aacc44", rep:80, desc:`Priya Sharma is in custody. The evidence held up in court. Vikram got away clean for now — but the recordings you found are with the CBI. Ravi Desai quietly resigned.\n\nA good night's work, Inspector. Not perfect. But good.` },
      partial: { badge:"🔶", title:"Case Partially Closed", color:"#cc8844", rep:40, desc:`You arrested the right person, but the evidence gaps gave Priya's lawyers room to maneuver. She pled to manslaughter. Vikram Nair walks free. The full conspiracy stays buried.\n\nSome justice is better than none. Some.` },
      wrong_vikram: { badge:"❌", title:"Wrong Arrest — Accessory, Not Killer", color:"#cc4444", rep:-40, desc:`Vikram Nair was arrested with insufficient evidence. His lawyers shredded the case in 48 hours. Released without charges. He fled to Singapore the next morning. Priya was promoted to Acting CEO.\n\nRajesh Khanna's murderer is running the company he built.` },
      wrong_ravi: { badge:"❌", title:"Wrong Arrest — Wrong Man", color:"#cc4444", rep:-50, desc:`Ravi Desai was arrested. He cooperated fully, confessing only to deleting footage. The DA declined to charge. You've wasted 72 hours and burned a potential witness. The real killers have gone cold.\n\nThe Commissioner is not pleased.` },
      wrong_aryan: { badge:"❌", title:"Wrong Arrest — Clean Suspect", color:"#cc2222", rep:-60, desc:`Aryan Kapoor's lawyers had him out in four hours. Airtight Delhi alibi. You've just handed them a harassment lawsuit. Priya and Vikram watched the news and exhaled together.\n\nYou owe Aryan Kapoor an apology. And the city a better detective.` },
      unsolved: { badge:"❓", title:"Case Gone Cold", color:"#668", rep:-20, desc:`Time ran out. The investigation stalled. Priya Sharma was promoted to CEO within a month. Vikram Nair settled the Mehrotra case quietly. Ravi Desai opened a security firm.\n\nRajesh Khanna's name fades. The city moves on. You don't.` },
    };
    const e = endings[type] || endings.unsolved;
    setReputation(r => r + e.rep);
    setEnding(e);
  }

  function makeArrest(suspId) {
    const susp = suspects[suspId];
    const a = analyzed.length;
    if (susp.id === "priya") {
      const hasKey = ["fingerprint_glass","documents_embezzle","blood_spatter","red_coat_fiber"].filter(id => evidence[id]?.analyzed).length;
      if (hasKey >= 3 && a >= 7) triggerEnding("perfect", suspId);
      else if (hasKey >= 2 && a >= 5) triggerEnding("good", suspId);
      else triggerEnding("partial", suspId);
    } else if (susp.id === "vikram") triggerEnding("wrong_vikram", suspId);
    else if (susp.id === "ravi") triggerEnding("wrong_ravi", suspId);
    else triggerEnding("wrong_aryan", suspId);
    setArrestConfirm(null);
    addLog(rnd(LOG_TEMPLATES.arrest(susp.name)), "warn");
  }

  function collectEvidence(evId) {
    const ev = evidence[evId];
    if (ev.found) { addLog(`Already in evidence bag: ${ev.name}`, "warn"); return; }
    setEvidence(prev => ({ ...prev, [evId]: { ...prev[evId], found:true } }));
    addLog(rnd(LOG_TEMPLATES.collect(ev.name)), "success");
    setReputation(r => r+5);
  }

  function analyzeEvidence(evId) {
    const ev = evidence[evId];
    if (!ev.found || ev.analyzed) return;
    setEvidence(prev => ({ ...prev, [evId]: { ...prev[evId], analyzed:true } }));
    addLog(rnd(LOG_TEMPLATES.analyze(ev.name, ev.result)), "success");
    setReputation(r => r+15);
  }

  async function askQuestion(suspId, qKey) {
    const susp = suspects[suspId];
    const q = susp.questions[qKey];
    if (!q || aiLoading) return;
    const isPressed = pressure[suspId];
    const hasEv = q.ev ? evidence[q.ev]?.analyzed : false;
    const local = isPressed ? q.pressure : (hasEv && q.ev_resp ? q.ev_resp : q.base);

    setInterrogLog(prev => [...prev, { role:"detective", text:q.text }, { role:"suspect", text:"...", loading:true }]);
    setAiLoading(true);

    try {
      const evList = Object.values(evidence).filter(e=>e.analyzed).map(e=>e.name).join(", ") || "none";
      const prompt = `You are ${susp.name}, ${susp.role}, age ${susp.age}. You're being interrogated about the murder of Rajesh Khanna, CEO of Apex Bank.

CHARACTER PROFILE:
- Guilt status: ${susp.guilty ? "GUILTY (you are the murderer)" : susp.id==="vikram" ? "ACCESSORY (you threatened the victim, were present, but did not kill)" : susp.id==="ravi" ? "ACCOMPLICE (bribed to delete CCTV footage, did not know murder would happen)" : "INNOCENT (solid alibi, no direct involvement)"}
- Your secret motive: ${susp.motive}
- Your alibi: ${susp.alibi}
- Your body language this session: ${isPressed ? "visibly anxious, defensive, micro-expressions of fear" : "controlled, measured, trying to appear cooperative"}

CONTEXT:
- Evidence detective has analyzed: ${evList}
- Pressure applied: ${isPressed ? "YES — detective has confronted you with hard evidence" : "No — normal questioning"}
- The detective asked: "${q.text}"
- Script baseline answer: "${local}"

INSTRUCTIONS:
Respond in character in 2-3 sentences. Be realistic — add natural hesitation (ellipses, pauses), specific details that feel true, subtext. Do NOT confess unless specifically scripted to. Match the tone of the baseline but make it feel like a real person speaking, not a script. Add one small human detail — a physical reaction, a deflection, a redirect.`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{ role:"user", content:prompt }] })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || local;
      setInterrogLog(prev => prev.map((m,i) => i===prev.length-1 ? {...m, text, loading:false} : m));
    } catch {
      setInterrogLog(prev => prev.map((m,i) => i===prev.length-1 ? {...m, text:local, loading:false} : m));
    }
    setAiLoading(false);
  }

  function applyPressure(suspId) {
    setPressure(p => ({...p, [suspId]:true}));
    addLog(rnd(LOG_TEMPLATES.pressure(suspects[suspId].name)), "warn");
    setReputation(r => r+3);
  }

  function checkBreak(suspId) {
    const susp = suspects[suspId];
    if (!susp.breakpoint?.length) return false;
    return susp.breakpoint.filter(b => evidence[b]?.analyzed).length >= 2;
  }

  if (screen==="intro") return (
    <div style={{ minHeight:520, background:"#060606", color:"#ddd", fontFamily:"monospace", borderRadius:12, overflow:"hidden" }}>
      <div style={{ background:"#0e0000", padding:"44px 28px 32px", textAlign:"center", borderBottom:"1px solid #2a0000" }}>
        <div style={{ fontSize:52, marginBottom:6 }}>🕵️</div>
        <div style={{ fontSize:30, fontWeight:800, color:"#cc3333", letterSpacing:4, marginBottom:4 }}>CASE CLOSED</div>
        <div style={{ fontSize:10, color:"#444", letterSpacing:8, marginBottom:20 }}>DETECTIVE MYSTERY · MUMBAI 2024</div>
        <div style={{ background:"#0e0000", border:"1px solid #2a0000", borderRadius:10, padding:"18px 22px", maxWidth:420, margin:"0 auto 24px", textAlign:"left" }}>
          <div style={{ color:"#cc4444", fontSize:10, letterSpacing:2, marginBottom:8 }}>◆ CASE FILE #001 · PRIORITY: CRITICAL</div>
          <div style={{ fontSize:18, color:"#eee", fontWeight:700, marginBottom:6 }}>The Midnight Banker</div>
          <div style={{ fontSize:11, color:"#777", lineHeight:1.8 }}>
            <b style={{ color:"#999" }}>Victim:</b> Rajesh Khanna, CEO of Apex Bank<br/>
            <b style={{ color:"#999" }}>Cause of death:</b> Blunt force trauma, right temporal lobe<br/>
            <b style={{ color:"#999" }}>Time of death:</b> 11:34–11:58 PM<br/>
            <b style={{ color:"#999" }}>Suspects:</b> 4 individuals with motive and opportunity<br/>
            <b style={{ color:"#999" }}>Evidence items:</b> 14 pieces across 5 locations<br/>
            <b style={{ color:"#999" }}>Time pressure:</b> 10 minutes before the trail goes cold
          </div>
        </div>
        <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap", marginBottom:24 }}>
          {["🔍 Investigate 5 locations","📦 Collect 14 evidence items","🔬 Run forensic analysis","🗣 Interrogate 4 suspects","🧩 Connect clues on board","⚖️ Arrest the killer"].map((s,i) => (
            <span key={i} style={{ fontSize:9, color:"#555", background:"#111", padding:"4px 8px", borderRadius:4, border:"1px solid #1a1a1a" }}>{s}</span>
          ))}
        </div>
        <button onClick={() => setScreen("game")} style={{ background:"#cc2222", border:"none", color:"#fff", padding:"12px 44px", borderRadius:8, fontSize:14, cursor:"pointer", letterSpacing:3, fontFamily:"monospace", fontWeight:700 }}>
          BEGIN INVESTIGATION
        </button>
      </div>
    </div>
  );

  if (ending) return (
    <div style={{ minHeight:420, background:"#060606", color:"#ddd", fontFamily:"monospace", padding:32, borderRadius:12, textAlign:"center" }}>
      <div style={{ fontSize:56, marginBottom:12 }}>{ending.badge}</div>
      <div style={{ fontSize:20, fontWeight:700, color:ending.color, marginBottom:12 }}>{ending.title}</div>
      <div style={{ fontSize:12, color:"#888", maxWidth:440, margin:"0 auto 24px", lineHeight:1.9, textAlign:"left", background:"#0d0d0d", borderRadius:10, padding:"16px 20px", whiteSpace:"pre-line" }}>{ending.desc}</div>
      <div style={{ display:"flex", gap:16, justifyContent:"center", marginBottom:24, flexWrap:"wrap" }}>
        <div style={{ background:"#111", borderRadius:8, padding:"12px 20px" }}>
          <div style={{ fontSize:9, color:"#444", marginBottom:4 }}>REPUTATION</div>
          <div style={{ fontSize:20, color:ending.rep>0?"#4aaa4a":"#aa4444" }}>{ending.rep>0?"+":""}{ending.rep}</div>
        </div>
        <div style={{ background:"#111", borderRadius:8, padding:"12px 20px" }}>
          <div style={{ fontSize:9, color:"#444", marginBottom:4 }}>EVIDENCE ANALYZED</div>
          <div style={{ fontSize:20, color:"#aaa" }}>{analyzed.length}/{Object.keys(EVIDENCE_DB).length}</div>
        </div>
        <div style={{ background:"#111", borderRadius:8, padding:"12px 20px" }}>
          <div style={{ fontSize:9, color:"#444", marginBottom:4 }}>FINAL RANK</div>
          <div style={{ fontSize:13, color: getRank(reputation).color }}>{getRank(reputation).title}</div>
        </div>
      </div>
      <button onClick={() => { setScreen("intro"); setEvidence(JSON.parse(JSON.stringify(EVIDENCE_DB))); setTimeLeft(600); setLogs([]); setInterrogLog([]); setEnding(null); setReputation(0); setPressure({}); setLocation(null); setTab("map"); }} style={{ background:"#1a1a1a", border:"1px solid #333", color:"#ccc", padding:"10px 28px", borderRadius:8, fontSize:12, cursor:"pointer", fontFamily:"monospace" }}>
        ↺ RESTART CASE
      </button>
    </div>
  );

  const locData = location ? LOCATIONS_DB[location] : null;
  const locEvidence = location ? Object.values(evidence).filter(e => e.location===location) : [];
  const isLab = location === "forensic_lab";

  return (
    <div style={{ background:"#060606", color:"#ccc", fontFamily:"monospace", borderRadius:12, overflow:"hidden", minHeight:600 }}>
      <div style={{ background:"#0c0000", borderBottom:"1px solid #220000", padding:"7px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ color:"#cc3333", fontSize:14, fontWeight:800, letterSpacing:2 }}>🕵️ CASE CLOSED</span>
          <span style={{ fontSize:9, color:"#333", letterSpacing:2, borderLeft:"1px solid #222", paddingLeft:10 }}>THE MIDNIGHT BANKER</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:14, fontSize:10 }}>
          <span style={{ color: timeLeft<120 ? "#cc2222" : timeLeft<300 ? "#cc8844" : "#cc6633", fontWeight:700 }}>⏱ {mins}:{secs}</span>
          <span style={{ color: rank.color }}>◆ {rank.title}</span>
          <span style={{ color:"#556677" }}>REP {reputation}</span>
          <span style={{ fontSize:9, color:"#333", background:"#111", padding:"2px 7px", borderRadius:3 }}>{dayPhase==="night" ? "🌙 NIGHT" : "🌅 DAWN"}</span>
        </div>
      </div>

      <div style={{ display:"flex", borderBottom:"1px solid #151515", background:"#080808" }}>
        {[["map","🗺 MAP"],["evidence","📦 EVIDENCE"],["suspects","👥 SUSPECTS"],["clues","🧩 CLUES"],["timeline","⏰ TIMELINE"],["log","📓 LOG"]].map(([t,l]) => (
          <button key={t} onClick={() => setTab(t)} style={{ flex:1, padding:"8px 2px", background: tab===t ? "#130000":"transparent", border:"none", borderBottom: tab===t ? "2px solid #cc3333":"2px solid transparent", color: tab===t ? "#cc7777":"#444", fontSize:9, cursor:"pointer", letterSpacing:1, fontFamily:"monospace" }}>{l}</button>
        ))}
      </div>

      <div style={{ padding:14, minHeight:500, overflowY:"auto", maxHeight:580 }}>

        {tab==="map" && (
          <div>
            <MiniMap current={location} onSelect={(k) => { setLocation(k); addLog(rnd(LOG_TEMPLATES.arrive(LOCATIONS_DB[k].name))); }} />
            {location && locData && (
              <div style={{ marginTop:14, background:"#0d0d0d", borderRadius:10, padding:14, border:"1px solid #181818" }}>
                <div style={{ fontSize:13, color:"#cc7744", marginBottom:4 }}>{locData.icon} {locData.name}</div>
                <div style={{ fontSize:10, color:"#888", lineHeight:1.7, marginBottom:6 }}>{locData.fullDesc}</div>
                <div style={{ fontSize:9, color:"#555", fontStyle:"italic", marginBottom:10 }}>{locData.atmosphere}</div>
                {isLab ? (
                  <div>
                    <div style={{ fontSize:10, color:"#446644", marginBottom:8, letterSpacing:1 }}>FORENSIC LAB — DROP COLLECTED EVIDENCE FOR ANALYSIS</div>
                    {Object.values(evidence).filter(e=>e.found&&!e.analyzed).length===0 && analyzed.length===0 && <div style={{ fontSize:11, color:"#333" }}>No evidence collected yet. Visit crime scenes first.</div>}
                    {Object.values(evidence).filter(e=>e.found&&!e.analyzed).map(ev => <EvidenceCard key={ev.id} ev={ev} onAnalyze={analyzeEvidence} isLab={true} />)}
                    {analyzed.map(ev => <EvidenceCard key={ev.id} ev={ev} isLab={true} />)}
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize:10, color:"#664422", marginBottom:8, letterSpacing:1 }}>ITEMS AT THIS LOCATION</div>
                    {locEvidence.length===0 ? <div style={{ fontSize:11, color:"#333" }}>Nothing visible here. Look closer.</div>
                      : locEvidence.map(ev => <EvidenceCard key={ev.id} ev={ev} onCollect={collectEvidence} isLab={false} />)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tab==="evidence" && (
          <div>
            <div style={{ fontSize:9, color:"#555", marginBottom:12, letterSpacing:2 }}>EVIDENCE LOCKER — {Object.values(evidence).filter(e=>e.found).length}/{Object.keys(evidence).length} COLLECTED · {analyzed.length} ANALYZED</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4, marginBottom:12 }}>
              {[["Collected",Object.values(evidence).filter(e=>e.found).length,"#cc8844"],["Analyzed",analyzed.length,"#44aa44"],["Remaining",Object.values(evidence).filter(e=>!e.found).length,"#554444"],["Leads",analyzed.reduce((a,e)=>a+(e.leads?.length||0),0),"#4477aa"]].map(([l,v,c]) => (
                <div key={l} style={{ background:"#0d0d0d", border:"1px solid #181818", borderRadius:6, padding:"8px 10px" }}>
                  <div style={{ fontSize:9, color:"#444" }}>{l}</div>
                  <div style={{ fontSize:18, color:c, fontWeight:700 }}>{v}</div>
                </div>
              ))}
            </div>
            {Object.values(evidence).map(ev => <EvidenceCard key={ev.id} ev={ev} onCollect={collectEvidence} onAnalyze={analyzeEvidence} isLab={false} />)}
          </div>
        )}

        {tab==="suspects" && (
          <div>
            {!interrogating ? (
              <div>
                <div style={{ fontSize:9, color:"#555", marginBottom:12, letterSpacing:2 }}>SUSPECT PROFILES — 4 INDIVIDUALS OF INTEREST</div>
                {Object.values(suspects).map(s => (
                  <SuspectCard key={s.id} susp={s} evidenceAnalyzed={analyzed} onInterrogate={(id) => { setInterrogating(id); setInterrogLog([]); addLog(rnd(LOG_TEMPLATES.interrogate(suspects[id].name))); }} onArrest={(id) => setArrestConfirm(id)} />
                ))}
              </div>
            ) : (
              <div>
                <button onClick={() => setInterrogating(null)} style={{ background:"transparent", border:"1px solid #222", borderRadius:5, padding:"4px 12px", color:"#666", fontSize:10, cursor:"pointer", marginBottom:12, fontFamily:"monospace" }}>← Exit Room</button>
                {(() => {
                  const s = suspects[interrogating];
                  const broke = checkBreak(interrogating);
                  return (
                    <div>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                        <div>
                          <div style={{ fontSize:13, color:"#cc8844" }}>INTERROGATION ROOM 2</div>
                          <div style={{ fontSize:10, color:"#666" }}>{s.icon} {s.name} · {pressure[s.id] ? <span style={{ color:"#cc4444" }}>⚡ UNDER PRESSURE</span> : "Normal session"}</div>
                        </div>
                        <div style={{ textAlign:"right", fontSize:9, color:"#444" }}>
                          <div>Questions asked: {interrogLog.filter(m=>m.role==="detective").length}</div>
                          <div>Recording: <span style={{ color:"#cc4444" }}>● LIVE</span></div>
                        </div>
                      </div>
                      <div style={{ fontSize:10, color:"#666", lineHeight:1.7, background:"#0a0a0a", borderRadius:7, padding:10, marginBottom:10, borderLeft:"2px solid #2a1a00" }}>
                        <b style={{ color:"#888" }}>Known facts:</b><br/>
                        {s.knownFacts?.map((f,i) => <span key={i}>· {f}<br/></span>)}
                      </div>
                      <div ref={logRef} style={{ background:"#060606", borderRadius:8, padding:12, minHeight:160, maxHeight:220, overflowY:"auto", marginBottom:10, border:"1px solid #111" }}>
                        {interrogLog.length===0 && <div style={{ fontSize:10, color:"#222" }}>[ Tape rolling. Room silent. Begin. ]</div>}
                        {interrogLog.map((m,i) => (
                          <div key={i} style={{ marginBottom:10, borderBottom:"1px solid #0d0d0d", paddingBottom:10 }}>
                            <div style={{ fontSize:8, color: m.role==="detective" ? "#336688" : "#884433", marginBottom:3, letterSpacing:1 }}>
                              {m.role==="detective" ? "🕵 DET. MEHTA" : `${s.icon} ${s.name.toUpperCase()}`}
                            </div>
                            <div style={{ fontSize:11, color: m.role==="detective" ? "#6699bb" : "#bb9966", lineHeight:1.7 }}>
                              {m.loading ? <span style={{ color:"#333" }}>[ {s.name.split(" ")[0]} shifts in chair... ]</span> : `"${m.text}"`}
                            </div>
                          </div>
                        ))}
                      </div>
                      {broke && s.confession && (
                        <div style={{ background:"#180000", border:"1px solid #440000", borderRadius:8, padding:10, marginBottom:10 }}>
                          <div style={{ fontSize:9, color:"#cc4444", letterSpacing:2, marginBottom:6 }}>⚡ BREAKING POINT REACHED — SUSPECT IS CRACKING</div>
                          <div style={{ fontSize:10, color:"#aa7766", lineHeight:1.7, fontStyle:"italic" }}>"{s.confession}"</div>
                        </div>
                      )}
                      <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:10 }}>
                        <div style={{ fontSize:9, color:"#444", letterSpacing:1, marginBottom:2 }}>SELECT QUESTION:</div>
                        {Object.entries(s.questions).map(([qk,q]) => {
                          const hasEv = q.ev ? evidence[q.ev]?.analyzed : false;
                          return (
                            <button key={qk} onClick={() => askQuestion(s.id, qk)} disabled={aiLoading} style={{ background: hasEv ? "#0d1800" : "#0d0d0d", border:`1px solid ${hasEv?"#1a3300":"#1a1a1a"}`, borderRadius:6, padding:"8px 12px", color: hasEv ? "#88bb44" : "#888", fontSize:11, cursor:"pointer", textAlign:"left", fontFamily:"monospace", opacity:aiLoading?0.4:1 }}>
                              {hasEv ? "🔥" : "💬"} {q.text}
                              {hasEv && <span style={{ fontSize:8, color:"#446622", marginLeft:8 }}>Evidence available</span>}
                            </button>
                          );
                        })}
                      </div>
                      <div style={{ display:"flex", gap:8 }}>
                        {!pressure[s.id] && <button onClick={() => applyPressure(s.id)} style={{ flex:1, background:"#1a0800", border:"1px solid #4a2000", borderRadius:6, padding:"7px", color:"#cc6622", fontSize:11, cursor:"pointer", fontFamily:"monospace" }}>⚡ Apply Pressure</button>}
                        <button onClick={() => setArrestConfirm(s.id)} style={{ flex:1, background:"#1a0000", border:"1px solid #4a0000", borderRadius:6, padding:"7px", color:"#cc3333", fontSize:11, cursor:"pointer", fontFamily:"monospace" }}>⚖️ Arrest {s.name.split(" ")[0]}</button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {tab==="clues" && (
          <div>
            <div style={{ fontSize:9, color:"#555", marginBottom:12, letterSpacing:2 }}>EVIDENCE → SUSPECT CONNECTION MAP</div>
            <ClueBoard evidence={evidence} suspects={suspects} />
            <div style={{ marginTop:12, display:"flex", gap:8, flexWrap:"wrap" }}>
              {Object.values(suspects).map(s => {
                const heat = Object.values(evidence).filter(e=>e.analyzed&&e.leads?.includes(s.id)).length;
                return <div key={s.id} style={{ fontSize:10, background:"#0d0d0d", border:`1px solid ${heat>=3?"#440000":heat>=2?"#442200":"#1a1a1a"}`, borderRadius:6, padding:"5px 10px", color: heat>=3?"#cc4444":heat>=2?"#cc8844":"#555" }}>{s.icon} {s.name}: {heat} link{heat!==1?"s":""}</div>;
              })}
            </div>
          </div>
        )}

        {tab==="timeline" && (
          <div>
            <Timeline evidence={evidence} />
            <div style={{ marginTop:20, background:"#0d0d0d", borderRadius:8, padding:12 }}>
              <div style={{ fontSize:9, color:"#555", letterSpacing:2, marginBottom:8 }}>MOTIVE MATRIX</div>
              {Object.values(suspects).map(s => {
                const ev = Object.values(evidence).filter(e=>e.analyzed&&e.leads?.includes(s.id));
                return (
                  <div key={s.id} style={{ marginBottom:10, borderBottom:"1px solid #111", paddingBottom:10 }}>
                    <div style={{ fontSize:11, color:"#aaa", marginBottom:3 }}>{s.icon} {s.name}</div>
                    <div style={{ fontSize:9, color:"#666", marginBottom:4 }}>{s.motive}</div>
                    {ev.length>0 && <div style={{ fontSize:9, color:"#556633" }}>Evidence supporting: {ev.map(e=>e.name).join(" · ")}</div>}
                    {ev.length===0 && <div style={{ fontSize:9, color:"#333" }}>No evidence links yet</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab==="log" && (
          <div>
            <div style={{ fontSize:9, color:"#555", marginBottom:10, letterSpacing:2 }}>DETECTIVE'S NOTEBOOK — {logs.length} ENTRIES</div>
            <div style={{ background:"#0a0a0a", borderRadius:8, padding:12, maxHeight:380, overflowY:"auto" }} ref={logRef}>
              {logs.length===0 && <div style={{ fontSize:10, color:"#222", fontStyle:"italic" }}>The notebook is empty. Start your investigation.</div>}
              {[...logs].reverse().map(l => (
                <div key={l.id} style={{ display:"flex", gap:10, marginBottom:8, borderBottom:"1px solid #0e0e0e", paddingBottom:8 }}>
                  <span style={{ fontSize:8, color:"#333", minWidth:38, paddingTop:2 }}>{l.time}</span>
                  <span style={{ fontSize:10, color: l.type==="success"?"#5aaa5a":l.type==="warn"?"#cc8844":"#666", lineHeight:1.6 }}>{l.msg}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop:14, background:"#0d0d0d", borderRadius:8, padding:12, border:"1px solid #181818" }}>
              <div style={{ fontSize:9, color:"#444", letterSpacing:1, marginBottom:8 }}>DETECTIVE PROFILE</div>
              <div style={{ fontSize:13, color:"#eee" }}>🕵️ Det. Arjun Mehta</div>
              <div style={{ fontSize:10, color: rank.color, marginBottom:6 }}>Rank: {rank.title}</div>
              <div style={{ background:"#111", borderRadius:3, height:5, overflow:"hidden", marginBottom:4 }}>
                <div style={{ width:`${Math.min(Math.max(reputation,0),400)/4}%`, height:"100%", background: rank.color, transition:"width 0.5s" }}/>
              </div>
              <div style={{ display:"flex", gap:12, fontSize:9, color:"#444", marginTop:8 }}>
                <span>Evidence: {analyzed.length}/{Object.keys(EVIDENCE_DB).length}</span>
                <span>Time left: {mins}:{secs}</span>
                <span>Reputation: {reputation}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {arrestConfirm && (
        <div style={{ position:"sticky", bottom:0, background:"#0e0000", borderTop:"1px solid #440000", padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
          <div style={{ fontSize:11, color:"#cc8844" }}>⚖️ Arrest <b style={{ color:"#eee" }}>{suspects[arrestConfirm].name}</b>? This ends the case.</div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => setArrestConfirm(null)} style={{ background:"#111", border:"1px solid #333", borderRadius:5, padding:"6px 14px", color:"#888", fontSize:11, cursor:"pointer", fontFamily:"monospace" }}>Cancel</button>
            <button onClick={() => makeArrest(arrestConfirm)} style={{ background:"#cc2222", border:"none", borderRadius:5, padding:"6px 14px", color:"#fff", fontSize:11, cursor:"pointer", fontFamily:"monospace", fontWeight:700 }}>CONFIRM ARREST</button>
          </div>
        </div>
      )}
    </div>
  );
}
