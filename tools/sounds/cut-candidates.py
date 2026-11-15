# cut each candidate: a little before and after the event, fade in 8 ms and out 60 ms, mono, peak at -3 dBFS, mp3
import subprocess, re, glob, json, os, sys
U = "/root/.claude/uploads/a42e1b09-02b5-51f8-a6f3-2547bf4b5974/"
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
src = lambda k: glob.glob(U + "*" + k + "*")[0]
C = [  # (key, group, label, file id, start, end)
 ("hiss1","hiss","Hiss (long)","386738",100.38,102.45),("hiss2","hiss","Hiss (short)","386738",100.38,101.1),
 ("meow1","meow","Annoyed meow, short","845517",0.14,0.6),("meow2","meow","Annoyed meow, long","845517",1.18,1.9),
 ("meow3","meow","Grumpy meow 1","851329",16.8,17.48),("meow4","meow","Grumpy meow 2","851329",21.45,22.85),
 ("meow5","meow","Grumpy mew, short","851329",22.97,23.45),("meow6","meow","Grumpy mew, shortest","851329",24.2,24.58),
 ("chirp1","chirp","Chirp 1","634174",4.13,4.75),("chirp2","chirp","Chirp 2","634174",7.27,7.75),
 ("chirp3","chirp","Chirp, tiny","634174",10.7,10.9),("chirp4","chirp","Chirp run","634174",11.46,12.85),
 ("chirp5","chirp","Chirp 3","634174",13.5,13.95),("chirp6","chirp","Chirp 4","634174",18.63,19.55),
 ("chirp7","chirp","Chirp 5","634174",21.73,22.25),
 ("chirp8","chirp","Little chirp 1","451250",0.56,0.76),("chirp9","chirp","Little chirp 2","451250",2.75,2.97),
 ("chirp10","chirp","Little chirp 3","451250",6.46,6.9),
 ("pchirp1","chirp","Purr-chirp 1","535318",3.66,4.32),("pchirp2","chirp","Purr-chirp 2","535318",4.58,5.7),
 ("pchirp3","chirp","Purr-chirp 3","535318",10.63,11.24),("pchirp4","chirp","Purr-chirp 4","535318",12.96,13.42),
 ("purr1","purr","Purr (Monique)","517896",2.0,3.5),("purr2","purr","Purr (soundmary)","194926",1.5,2.55),
 ("purr3","purr","Kitty purr 1","553375",1.0,2.5),("purr4","purr","Kitty purr 2","553375",4.6,6.1),
 ("purr5","purr","Purr (Daphne)","383473",13.5,14.85),
 ("yawn1","yawn","Yawn? (Daphne, 59 s)","383473",59.25,60.5),("yawn2","yawn","Yawn? longer","383473",59.1,61.2),
 ("toy1","toy","Toy play 1","594132",4.57,4.95),("toy2","toy","Toy play 2","594132",6.77,7.68),
 ("toy3","toy","Toy jingle 1","676536",8.22,8.98),("toy4","toy","Toy jingle 2","676536",11.4,12.28),("toy5","toy","Toy jingle 3","676536",2.03,2.4),
 ("splash1","splash","Splash 1","186747",0.0,0.45),("splash2","splash","Splash 2","186746",0.0,0.36),
]
meta = []
for k,g,lab,fid,a,b in C:
    f = src(fid); d = b - a
    pk = subprocess.run(["ffmpeg","-v","info","-ss",str(a),"-t",str(d),"-i",f,"-ac","1","-af","volumedetect","-f","null","-"],capture_output=True,text=True).stderr
    mx = float(re.search(r"max_volume: (-?[\d.]+) dB", pk).group(1)); gain = -3 - mx
    subprocess.run(["ffmpeg","-v","error","-y","-ss",str(a),"-t",str(d),"-i",f,"-ac","1","-ar","44100",
      "-af",f"volume={gain}dB,afade=t=in:d=0.008,afade=t=out:st={max(0,d-0.06):.3f}:d=0.06","-b:a","96k",f"{OUT}/{k}.mp3"],check=True)
    meta.append({"k":k,"g":g,"label":lab,"fid":fid,"dur":round(d,2)})
print(json.dumps(meta))
