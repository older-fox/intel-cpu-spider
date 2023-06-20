import mongoose from "mongoose";
const Schema = mongoose.Schema

const intelCpuSchema = new Schema({
    id:Number,
    title:String,
    essentials: {
        name:String,
        collection: String,
        codeName: String,
        verticalSegment: String,
        processorNumber: String,
        lithography: String,
        manufacturer: String,
        recommendedCustomerPrice: {
            min: Number,
            max: Number
        },
        useConditions: [String]
    },
    specifications: {
        cores: {
            performance: Number,
            efficient: Number,
            total: Number,
        },
        threads: Number,
        frequency: {
            maxTurbo: {
                single: String,
                performanceCore: String,
                efficientCore: String
            },
            base: {
                performanceCore: String,
                efficientCore: String,
                single:String
            }
        },
        cache: {
            L3: String,
            L2: String
        },
        tdp:String,
        busSpeed:String,
        power: {
            min: Number,
            max: Number
        }
    },
    marketing: {
        status: String,
        date: String,
        embeddedOptionsAvailable: Boolean
    },
    memory: {
        maxSize: String,
        support: {
            ddr5: Boolean,
            ddr4: Boolean,
            ddr3: Boolean,
            ddr2: Boolean,
            lpddr2: Boolean,
            lpddr3: Boolean,
            lpddr4: Boolean,
            lpddr5: Boolean,
            rawText:String,
        },
        maxChannels: Number,
        maxBandwidth: String,
        eccSupport: Boolean
    },
    graphics: {
        name: String,
        frequency: {
            base: String,
            maxDynamicFrequency: String
        },
        output: String,
        executionUnits: Number,
        maxResolution: {
            hdmi: String,
            dp: String,
            eDP: String,
            vga: String
        },
        videoEncode:{
            encoders:Number,
            qsv:Boolean,
        },
        directX: String,
        OpenGL: String,
        OpenCL: String
    },
    expansion: {
        thunderbolt:{
            "3":Boolean,
            "4":Boolean
        },
        pcie: {
            revision: {
                cpu:String,
                chipset:String
            },
            lanes: Number,
            configuration:String
        }
    },
    package: {
        socket: String,
        size:String,
        maxCpuSupported:Number,
    },
    advancedTechnologies:{
        //Intel® Threat Detection Technology (TDT)
        tdt:Boolean,
        //Intel® Standard Manageability (ISM)
        ism:Boolean,
        //Intel® Control-Flow Enforcement Technology
        cet:Boolean,
        //Intel® Virtualization Technology
        VTx:Boolean,
        //Intel® Virtualization Technology for Directed I/O
        VTd:Boolean,
        //Intel® VT-x with Extended Page Tables
        ept:Boolean,
    },
    chipSet: [String],
    resources: {
        image: String,
        score: {
            overAll: Number,
            multi: Number,
            single: Number
        }
    }
},{timestamps:true})


export const intelCpu = mongoose.model('intel_cpu',intelCpuSchema)