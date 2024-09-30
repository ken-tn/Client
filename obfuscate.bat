:: npm exec to enter environment
@echo off
SET /A seed=30223

for /f "tokens=*" %%f in (obfuscatelist.txt) do (
    javascript-obfuscator %%f -o %%f --seed=%seed% --string-array-threshold 0.46 --string-array-wrappers-count 3
)