"use client";
import {create} from "zustand";
export const useUI=create<{sidebar:boolean;setSidebar:(open:boolean)=>void}>(set=>({sidebar:false,setSidebar:sidebar=>set({sidebar})}));
