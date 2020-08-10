#!/usr/bin/env python
# coding: utf-8

# In[6]:


try:
    import csv
    import json
except:
    pass

# csv
def list_to_csv(filename, data_list):
    with open(f'{filename}','w',encoding='utf-8',newline='') as file:
        writer = csv.writer(file)
        for data in data_list:
            writer.writerow((i for i in data))

def csv_to_list(filename):
    exports = []
    with open(f'{filename}','r',encoding='utf-8') as file:
        export = ''
        reader = csv.reader(file)
        for row in reader:
            if row == []:
                continue
            export = ','.join(row)
            exports.append(export)
    return exports

# json
def list_to_json(filename, data_list):
    with open(f'{filename}','w',encoding='utf-8-sig') as file:
        file.write(json.dumps(data_list, ensure_ascii=False, indent=4))

def json_to_list(filename):
    data = []
    with open(f'{filename}','r',encoding='utf-8-sig') as file:
        data = json.loads(file.read())
    return data

if __name__ == "__main__":
    data = [('가버나움', '9.59'),
 ('위대한 쇼맨', '9.39'),
 ('패왕별희 디 오리지널', '9.31'),
 ('톰보이', '9.29'),
 ('나, 다니엘 블레이크', '9.27'),
 ('러빙 빈센트', '9.22'),
 ('어느 가족', '9.20'),
 ('시간을 달리는 소녀', '9.20'),
 ('스타 이즈 본', '9.17'),
 ('늑대아이', '9.11'),
 ('타오르는 여인의 초상', '9.04'),
 ('타샤 튜더', '9.03'),
 ('동감', '8.99'),
 ('씨민과 나데르의 별거', '8.95'),
 ('신세계', '8.92'),
 ('마담 프루스트의 비밀정원', '8.92'),
 ('트롤: 월드 투어', '8.90'),
 ('1917', '8.87'),
 ('라이프 오브 파이', '8.85'),
 ('작은 아씨들', '8.80'),
 ('너의 이름은.', '8.77'),
 ('가장 따뜻한 색, 블루', '8.76'),
 ('이별의 아침에 약속의 꽃을 장식하자', '8.72'),
 ('마미', '8.68'),
 ('썸머 워즈', '8.67'),
 ('찬실이는 복도 많지', '8.61'),
 ('라라랜드', '8.60'),
 ('비커밍 제인', '8.57'),
 ('괴물의 아이', '8.51'),
 ('기생충', '8.50'),
 ('아비정전', '8.47'),
 ('보리밭을 흔드는 바람', '8.46'),
 ('로렌스 애니웨이 ', '8.42'),
 ('좋아해, 너를', '8.36'),
 ('프리즌 이스케이프', '8.35'),
 ('콜드 워', '8.29'),
 ('프란시스 하', '8.10'),
 ('오퍼나지: 비밀의 계단', '8.02'),
 ('날씨의 아이', '7.94'),
 ('오직 사랑하는 이들만이 살아남는다', '7.74'),
 ('멜랑콜리아', '7.72'),
 ('마이 스파이', '7.71'),
 ('엽문4: 더 파이널', '7.67'),
 ('인비저블맨', '7.60'),
 ('멀홀랜드 드라이브', '7.50'),
 ('단지 세상의 끝', '7.46'),
 ('언더워터', '7.31'),
 ('더 플랫폼', '7.25'),
 ('유령선', '6.28'),
 ('미래의 미라이', '6.01')]
    list_to_csv('movie.csv', data)
    print(csv_to_list('movie.csv'))

