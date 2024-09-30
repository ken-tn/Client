:: npm exec to enter environment
@echo off
SET /A seed=3022

for /f "tokens=*" %%f in (obfuscatelist.txt) do (
    javascript-obfuscator %%f -o %%f --seed=%seed% --compact true --rename-properties true --self-defending false --split-strings true
)