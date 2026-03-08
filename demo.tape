Output demo.gif
Set FontSize 20
Set Width 1000
Set Height 580
Set Shell "zsh"
Set Theme "Catppuccin Mocha"
Set TypingSpeed 30ms
Set Padding 24

Type "node"
Enter
Sleep 1s

Type "const { easterWestern, easterOrthodox, daysUntil } = await import('holidayfyi')"
Enter
Sleep 1.5s

Type "easterWestern(2026)"
Enter
Sleep 2s

Type "easterOrthodox(2026)"
Enter
Sleep 2s

Type "daysUntil(12, 25)"
Enter
Sleep 2s

Type ".exit"
Enter
Sleep 1s
