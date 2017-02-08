// pages/apply/applysubject.js
//获取应用实例
var app = getApp();
var util = require('../../utils/util.js');
Page({
    data: {
        headExamTypeIndex: 0,
        examSubjectIndex: 0,
        provinceListIndex: 0,
        examPlaceIndex: 0,
        longitude: wx.getStorageSync("longitude"),
        latitude: wx.getStorageSync("latitude"),
        markers: [{
            iconPath: "/images/map/localization.png",
            id: 0,
            latitude: wx.getStorageSync("latitude"),
            longitude: wx.getStorageSync("longitude"),
            width: 20,
            height: 20
        }]

    },


    onLoad: function () {

        //考试报名列表
        util.https(app.globalData.api + "/GetHeadExamType", "GET", {
                praviteKey: 'oiox3tmqu1sn56x7occdd'
            }
            ,
            this.getHeadExamType
        )

    },
    //考试报名列表
    getHeadExamType: function (data) {
        var headExamTypeArr = [];
        for (var index in data.Data) {
            var item = data.Data[index];
            if (item.IsActive == 1 || item.IsActive == 2) {//只显示IsActive 是1或者2的考试类型
                headExamTypeArr.push(item);
            }

        }
        this.setData({
            headExamType: headExamTypeArr
        });

    },
    //事件处理函数
    applyperson: function () {
        wx.navigateTo({
            url: 'applyperson'
        })
    },
    //考试名称选择
    bindNamePickerChange: function (e) {
        this.setData({
            headExamTypeIndex: e.detail.value
        })

        //考试科目获取
        util.https(app.globalData.api + "/GetExamSubject", "GET", {
                inputJson: {
                    ExamTypeId: this.data.headExamType[e.detail.value].ExamTypeId//考试类型ID， 如果是培训默认给6.
                },
                praviteKey: 'oiox3tmqu1sn56x7occdd'
            },
            this.getExamSubject
        )
    },
    //考试科目获取
    getExamSubject: function (data) {
        console.log(data);
        this.setData({
            examSubject: data.Data
        });

    },
    //考试科目选择
    bindexamSubjectPickerChange: function (e) {
        this.setData({
            examSubjectIndex: e.detail.value
        })
        //考试的省份获取
        util.https(app.globalData.api + "/GetExamProvinceList", "GET", {
                inputJson: {
                    ExamTypeId: this.data.examSubject[e.detail.value].ExamTypeId //考试类型ID  如果给空或者0，则返回全部省份
                },
                praviteKey: 'oiox3tmqu1sn56x7occdd'
            },
            this.getExamProvinceList
        )
    },

    //考试的省份获取
    getExamProvinceList: function (data) {
        console.log(data);
        this.setData({
            examProvinceList: data.Data
        });

    },
    //考试的省份选择
    bindProvincePickerChange: function (e) {
        this.setData({
            provinceListIndex: e.detail.value
        })
        //考点获取
        util.https(app.globalData.api + "/GetExamPlace", "GET", {
                inputJson: {
                    SubjectID: this.data.examSubject[this.data.examSubjectIndex].ExamTypeId,//用户选中的考试科目ID,如果有多个，一定要加,号分割，如果只有一个科目一定不要加,号.
                    Latitude: wx.getStorageSync("latitude"), //纬度
                    Longitude: wx.getStorageSync("longitude"), //经度
                    ProvinceName: this.data.examSubject[e.detail.value].ProvinceName //省份名称,可以为空
                },
                praviteKey: 'oiox3tmqu1sn56x7occdd'
            },
            this.getExamPlace
        )
    },
    //考点获取
    getExamPlace: function (data) {
        console.log(data);
        this.setData({
            examPlace: data.Data,
            examPlaceItem:data.Data[0]
        });

    },
    //考点获取选择
    bindExamPlacePickerChange: function (e) {
        this.setData({
            examPlaceIndex: e.detail.value,
            examPlaceItem:this.data.examPlace[e.detail.value]
        })

    }
})