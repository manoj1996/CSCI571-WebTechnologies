package com.example.news_android;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentStatePagerAdapter;

public class NewsPagerAdapter extends FragmentStatePagerAdapter {
    private int countTabs;
    public NewsPagerAdapter(FragmentManager fm, int countTabs){
        super(fm);
        this.countTabs = countTabs;
    }

    @NonNull
    @Override
    public Fragment getItem(int position) {
        switch (position){
            case 0:
                return new WorldNewsFragment();
            case 1:
                return new BusinessNewsFragment();
            case 2:
                return new PoliticsNewsFragment();
            case 3:
                return new SportsNewsFragment();
            case 4:
                return new TechnologyNewsFragment();
            case 5:
                return new ScienceNewsFragment();
        }
        return null;
    }

    @Override
    public int getCount() {
        return countTabs;
    }
}
