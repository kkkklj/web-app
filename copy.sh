#! /bin/bash

echo '转移指定目录下文件进程启动'
originPath=/c/Users/BDA/Desktop/github/cloud/Basics/
targetPath="$(pwd)/_posts/"
#复制的文件类型
matchType=("*.png" "*.md" "*.jpg")
#添加目录
matchPath=$(find $originPath -type d -not -path '*/.*')
#添加文件
for i in ${matchType[@]};
do      
        filePath=$(find $originPath -name $i);
        matchPath="${matchPath} ${filePath}"
done
for i in ${matchPath[@]}
do      
        #目录操作
        if [ -d $i ];then
                dirName=$i
                outDirName=${dirName/${originPath}/${targetPath}}
                if [ ! -d $outDirName ]; then
                        mkdir -p $outDirName
                fi
        fi

        # #文件操作
        if [ -f $i ];then
                fileName=$i
                filePath=${fileName/${originPath}/${targetPath}}
                cp -r $i  "${filePath}"
        fi
done


echo '转移指定目录下文件进程结束'
