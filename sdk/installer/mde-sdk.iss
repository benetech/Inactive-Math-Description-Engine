; -- mde-sdk.iss --
; Create the MDE Software Development Kit Windows installer.

[Setup]
AppName=Math Description Engine Software Development Kit
AppVerName=Math Description Engine SDK {#SDKVERNAME}
DefaultDirName={sd}\{#SDKBASEDIRNAME}
OutputBaseFilename={#SDKBASEFILENAME}
DefaultGroupName=Math Description Engine SDK
LicenseFile=..\LICENSE.rtf

[Files]
Source: ..\LICENSE.rtf; DestDir: {app}
Source: ..\LICENSE.txt; DestDir: {app}
Source: ..\lib\*; DestDir: {app}\lib
Source: ..\docs\*; DestDir: {app}\docs; Flags: recursesubdirs
Source: ..\docs\CHANGES.txt; DestDir: {app}\docs
Source: ..\docs\developers_website.url; DestDir: {app}\docs
Source: ..\docs\ProgrammersGuide.pdf; DestDir: {app}\docs
Source: ..\examples\*; DestDir: {app}\examples

[Icons]
Name: {group}\MDE API Documentation; Filename: {app}\docs\api\index.html
Name: {group}\MDE Programmers Guide; Filename: {app}\docs\ProgrammersGuide.pdf; WorkingDir: {app}
Name: {group}\MDE Developers Website; Filename: {app}\docs\developers_website.url
name: {group}\Examples; Filename: {app}\examples; WorkingDir: {app}\examples
Name: {group}\Uninstall Math Description Engine SDK; Filename: {uninstallexe}; WorkingDir: {app}
