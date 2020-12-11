^D::
	Text := "<i class=""fa-"
	Loop, parse, Text
	{
		Send %A_LoopField%
		Sleep 75
	}	
	Send ^{Space}
	Sleep 500
	Text := "chevron-"
	Loop, parse, Text
	{
		Send %A_LoopField%
		Sleep 90
	}
	Sleep 500
	Send {Down}
	Sleep 330
	Send {Down}
	Sleep 330
	Send {Down}
	Sleep 330
	Send {Down}
	Sleep 330
	Send {Enter}
	Sleep 75
	Send {Right}
	Sleep 75
	Send >
	Sleep 75
	