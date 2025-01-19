# Voice Direction Processing System (VDPS)
The Voice Direction Processing System is an IOT system consisting of Raspberry Pi hardware units and a full stack React/AWS web application, 
capable of detecting and displaying sound direction up to 4 meters away with 95% accuracy.

<img align="center" src="https://github.com/nickroxcks/VDPS_Public/assets/34073804/9ea3d0eb-b36e-4be2-b449-81619db42710">

![image](https://github.com/nickroxcks/VDPS_Public/assets/34073804/9ea3d0eb-b36e-4be2-b449-81619db42710) 

Features included a live compass on the web application displaying real time sound direction around hardware units from any smartphone or computer, 
reviewing and saving recordings, user registration, sound wave analysis, and much more. 

For the full design and technical specifications, please review design document VDPS_DesignDocument.docx.pdf for more.

![image](https://github.com/nickroxcks/VDPS_Public/assets/34073804/56c021ef-cfc8-4594-ba9e-a335c9badb76)

The VDPS was a solution devloped for Univeristy of Alberta Client Dr Steven Knudsen to create a system capable of detecting voices within a 4x4 m2
enclosed room [3]. The client requirements were to use the Raspberry Pi microcomputer system, detect and localize sound, and provide analystics to the user
via an API and web application. This type of system is useful for home automation companies, and can be used to enhance speaker intelligibility, in addition to assisting in other IoT related roles.

![image](https://github.com/nickroxcks/VDPS_Public/assets/34073804/fa61689a-4859-4a08-8dc0-c372291e082a)

GCC-PHAT was the selected algorithm that was leveraged to localize incoming sound, and the ReSpeaker
4 Microphone Array System was used to triangulate the incoming sound sources. GCC-PHAT is based on
conventional cross-correlation algorithms used to localize sound, and suited this project adequately [4].
VDPS is based on a two block system composed of a hardware unit functioning as the sound recording
and processing center, and purely software backend designed to store recordings and provide simple
data visualization. The frontend unit is composed of the Raspberry Pi and the Respeaker, and connects to
a hosted web application.

This solution offers superior scalability and is advantageous for the end user as it provides a simple
setup, and user friendly interface. One of the major goals of VDPS is to be as elegant and simple to the
user as possible, while retaining as much insight as possible from the collected data. Furthermore,
accuracy is of the utmost importance to VDPS, which is achieved via the GCC-PHAT Algorithm.
