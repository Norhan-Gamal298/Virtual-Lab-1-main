import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ChapterManager from '../../components/ChapterManager';
import TopicManager from '../../components/TopicManager';

const Content = () => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Content Management</h1>

            <Tabs selectedIndex={activeTab} onSelect={setActiveTab}>
                <TabList>
                    <Tab>Chapters</Tab>
                    <Tab>Topics</Tab>
                </TabList>

                <TabPanel>
                    <ChapterManager />
                </TabPanel>

                <TabPanel>
                    <TopicManager />
                </TabPanel>
            </Tabs>
        </div>
    );
};

export default Content;