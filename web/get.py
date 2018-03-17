import requests
from bs4 import BeautifulSoup
import os
reppath="http://oa.ncschina.com/"
pathf="seeyon/main/common/js/frame-common.js?V=V5_0SP2_2014-08-26"
#http://oa.ncschina.com/seeyon/apps_res/collaboration/js/newCollaboration.js?V=V5_0SP2_2014-08-26d"
#reppath="https://raw.github.com/"+repname+"/master/"
outputpath="."
def getfile(pathf):
    print("get file:"+pathf)
    #reppath="https://raw.githubusercontent.com/"+repname+"/master/"
    #print(reppath)
    #print reppath+pathf
    #raw_input("pause")
    res=requests.get(reppath+pathf)#"Classes/AppDelegate.h")
    ps=pathf.split("/")
    p="/".join(ps[:-1])
    p=outputpath+"/"+p
    print(p)
    if not os.path.exists(p):
        os.makedirs(p)
    fn=p+"/"+ps[-1]
    #print(fn)
    fn=fn.split("?")[0]
    open(fn,"wb").write(res.content)
def getpath(path):
    print("getpath:"+path)
    if path=="":
        path="https://github.com/"+repname
        res=requests.get(path)
    else:
        print(reppath+path)
        res=requests.get(reppath+path)
    soup = BeautifulSoup(res.content)
    tbs=soup.find_all('table')
    #print(tbs)
    t=tbs[0].tbody
    rs=t.find_all('tr')
    fs=[]
    paths=[]
    for r in rs:
        cs=r.find_all('td')
        #print(cs)
        #print(cs[0])
        print(cs[0].svg)
        print(cs[0])
        if cs[0].svg!=None:
            cls=cs[0].svg['class']
            print("class="+str(cls))
            if cls==None:
                pass
            elif cls[1]==u"octicon-file-directory":
                print("ispath")
                f=cs[1].a['href']
                ps=f.split("/")
                childpath="/".join(ps[5:])
                print(childpath)
                paths.append(childpath)
            elif cls[1]=="octicon-alert":
                pass
            else:
                print("is file")
                fs.append(cs[1].a['href'])
    for f in fs:
        print(f)
        ps=f.split("/")
        getfile("/".join(ps[5:]))
    for p in paths:
        getpath(p)
def setrepname(nm):
	global repname
	global reppath
	global outputpath
	repname=nm
	outputpath=nm.split("/")[1]
	reppath="https://github.com/"+repname+"/tree/master/"
def main():
    setrepname("facebook/flux")
    getpath("examples")#all
    #getpath("Resources")#all
if __name__=="__main__":
    reppath="http://oa.ncschina.com/"#seeyon/main/common/js/frame-common.js?V=V5_0SP2_2014-08-26"
    pathf="seeyon/main/common/js/frame-common.js?V=V5_0SP2_2014-08-26"
    url="http://oa.ncschina.com/seeyon/apps_res/doc/js/knowledgeBrowseUtils.js?V=V5_0SP2_2014-08-26"
    url="http://oa.ncschina.com/seeyon/apps_res/uc/chat/js/jsjac.js?V=V5_0SP2_2014-08-26"
    url="http://oa.ncschina.com/seeyon/apps_res/uc/chat/js/shared.js?V=V5_0SP2_2014-08-26"
    url="http://oa.ncschina.com/seeyon/apps_res/uc/chat/js/uc_onlinemsg.js?V=V5_0SP2_2014-08-26"
    url="http://oa.ncschina.com/seeyon/common/js/jquery.comp-debug.js?V=V5_0SP2_2014-08-26"
    url="http://oa.ncschina.com/seeyon/main/common/js/frame-min.js?V=V5_0SP2_2014-08-26"
    url="http://oa.ncschina.com/seeyon/apps_res/v3xmain/js/guestbook.js?V=V5_0SP2_2014-08-26"
    url="http://oa.ncschina.com/seeyon/common/js/memberMenu.js?V=V5_0SP2_2014-08-26"
    url="http://oa.ncschina.com/seeyon/common/js/V3X.js?V=V5_0SP2_2014-08-26"
    url="http://oa.ncschina.com/seeyon/common/all-min.js?V=V5_0SP2_2014-08-26"
    url="http://oa.ncschina.com/seeyon/decorations/js/jquery-ui.custom.js?V=V5_0SP2_2014-08-26"
    urls=["http://oa.ncschina.com/seeyon/decorations/js/jquery.metadata.js?V=V5_0SP2_2014-08-26"
            ,"http://oa.ncschina.com/seeyon/decorations/js/portal-common.js?V=V5_0SP2_2014-08-26"
            ,"http://oa.ncschina.com/seeyon/decorations/js/section.js?V=V5_0SP2_2014-08-26"]
    urls=["http://oa.ncschina.com/seeyon/decorations/js/space.js?V=V5_0SP2_2014-08-26"
            ,"http://oa.ncschina.com/seeyon/decorations/js/spacedd.js?V=V5_0SP2_2014-08-26"
            ,"http://oa.ncschina.com/seeyon/decorations/js/section.js?V=V5_0SP2_2014-08-26"]
    
    for url in urls:
        (reppath,pathf)=url.split("oa.ncschina.com")
        reppath=reppath+"oa.ncschina.com"
        print(reppath,pathf)
        getfile(pathf)















