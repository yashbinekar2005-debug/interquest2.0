import edge_tts
import asyncio
import os
import threading
import pygame
 
# voice = "en-AU-WilliamNeural"  # You can change the voice as needed
voice = "en-GB-RyanNeural"  # You can change the voice as needed
BUFFER_SIZE = 1024

def remove_file(file_path):
    max_attempts=3
    attempts=0
    while attempts < max_attempts:
        try:
            with open(file_path,"wb"):
                pass
            os.remove(file_path)
            break
        except Exception as e:
            print(f"error remving file :{e}")
            attempts += 1
# async function to generate tts
async def amain(TEXT , ouput_file):
    try:
        print("\033[92mGenerating TTS...\033[0m")  # Green text
        cm_text=edge_tts.Communicate(TEXT, voice)
        await cm_text.save(ouput_file)
        print("\033[94mTTS Generation Complete.\033[0m")  # Blue text
    except Exception as e:
        print(f"\033[91mError during TTS generation: {e}\033[0m")  # Red text


# function to play audio     
def play_audio(file_path):
    pygame.init()
    pygame.mixer.init()
    pygame.mixer.music.load(file_path)
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy():
        continue
    pygame.mixer.quit()
    
# function to handle tts and playback using threads
def speak(TEXT):
    ouput_file="output.mp3"
    # therad for tts genartion
    tts_thread=threading.Thread(target=lambda:asyncio.run(amain(TEXT, ouput_file)))
    tts_thread.start()
    tts_thread.join() # wait for tts to finish

    # therad for audio playback
    if os.path.exists(ouput_file):
        play_thread=threading.Thread(target=play_audio,args=(ouput_file,))
        play_thread.start()
        play_thread.join()
        # clean up file 
        remove_file(ouput_file)
# speak("Welcome back sir. How can I help you today?")

